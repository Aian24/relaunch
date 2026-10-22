import { Pool, QueryResultRow } from 'pg';
import type {
  Client,
  Batch,
  Script,
  Asset,
  Variant,
  Review,
  ComplianceLog,
  VariantStatus,
} from './types';

/**
 * PostgreSQL Connection Pool
 * Connects to PostgreSQL 16 container or external managed Postgres
 */
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://studio_admin:relaunch_studio_dev_pass_2026@localhost:5432/relaunch_studio';

export const pool = new Pool({
  connectionString,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Generic query executor with automatic connection release
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production' && duration > 500) {
    console.warn(`[DB Slow Query] ${duration}ms: ${text.slice(0, 80)}...`);
  }
  return res.rows;
}

/**
 * Fetch client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  const rows = await query<Client>('SELECT * FROM clients WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

/**
 * Create or register a client
 */
export async function createClient(data: {
  name: string;
  website: string;
  contact_email: string;
  contact_phone?: string;
}): Promise<Client> {
  const rows = await query<Client>(
    `INSERT INTO clients (name, website, contact_email, contact_phone)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.website, data.contact_email, data.contact_phone || null]
  );
  return rows[0];
}

/**
 * Fetch all video variants pending review
 */
export async function getVariantsForReview(limit = 20): Promise<Variant[]> {
  return query<Variant>(
    `SELECT * FROM variants WHERE status = 'needs_review' ORDER BY created_at ASC LIMIT $1`,
    [limit]
  );
}

/**
 * Update the state of a video variant
 */
export async function updateVariantStatus(
  variantId: string,
  status: VariantStatus,
  extra?: { storage_url?: string; thumbnail_url?: string }
): Promise<Variant | null> {
  const rows = await query<Variant>(
    `UPDATE variants
     SET status = $2,
         storage_url = COALESCE($3, storage_url),
         thumbnail_url = COALESCE($4, thumbnail_url)
     WHERE id = $1
     RETURNING *`,
    [variantId, status, extra?.storage_url || null, extra?.thumbnail_url || null]
  );
  return rows[0] || null;
}

/**
 * Insert a human QA decision into the reviews safety gate table
 */
export async function recordReviewDecision(data: {
  variant_id: string;
  reviewer_name: string;
  decision: 'approve' | 'reject' | 'recut';
  notes?: string;
  checklist_verified?: Record<string, boolean>;
}): Promise<Review> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const reviewRes = await client.query<Review>(
      `INSERT INTO reviews (variant_id, reviewer_name, decision, notes, checklist_verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.variant_id,
        data.reviewer_name,
        data.decision,
        data.notes || null,
        JSON.stringify(data.checklist_verified || {}),
      ]
    );

    // Synchronize variant status based on human decision
    const nextVariantStatus: VariantStatus =
      data.decision === 'approve' ? 'approved' : data.decision === 'reject' ? 'rejected' : 'rendering';

    await client.query(
      `UPDATE variants SET status = $2 WHERE id = $1`,
      [data.variant_id, nextVariantStatus]
    );

    await client.query('COMMIT');
    return reviewRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Append immutable audit record to compliance_log
 */
export async function logComplianceRecord(data: {
  variant_id: string;
  ai_elements: string[];
  label_applied: string;
  license_refs_json: Record<string, unknown>;
}): Promise<ComplianceLog> {
  const rows = await query<ComplianceLog>(
    `INSERT INTO compliance_log (variant_id, ai_elements, label_applied, license_refs_json)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      data.variant_id,
      data.ai_elements,
      data.label_applied,
      JSON.stringify(data.license_refs_json),
    ]
  );
  return rows[0];
}

/**
 * Fetch script and all associated media assets
 */
export async function getScriptWithAssets(scriptId: string): Promise<{
  script: Script | null;
  assets: Asset[];
}> {
  const scriptRows = await query<Script>('SELECT * FROM scripts WHERE id = $1 LIMIT 1', [scriptId]);
  const assetRows = await query<Asset>('SELECT * FROM assets WHERE script_id = $1', [scriptId]);
  return {
    script: scriptRows[0] || null,
    assets: assetRows,
  };
}

/**
 * Clean disconnect for graceful container shutdown
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
