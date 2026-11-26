import { Pool, type PoolClient, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __relaunchStudioPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __relaunchStudioPgPoolUrl: string | undefined;
  // eslint-disable-next-line no-var
  var __relaunchStudioPgAvailable: { ok: boolean; checkedAt: number; error?: string } | undefined;
}

export function getStudioPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL?.trim() || "";
  if (!connectionString) return null;
  if (globalThis.__relaunchStudioPgPool && globalThis.__relaunchStudioPgPoolUrl !== connectionString) {
    globalThis.__relaunchStudioPgPool = undefined;
    globalThis.__relaunchStudioPgAvailable = undefined;
  }
  if (!globalThis.__relaunchStudioPgPool) {
    globalThis.__relaunchStudioPgPoolUrl = connectionString;
    globalThis.__relaunchStudioPgPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 1500,
    });
    globalThis.__relaunchStudioPgPool.on("error", (err) => {
      console.warn("[StudioDB] Pool error:", err.message);
      globalThis.__relaunchStudioPgAvailable = { ok: false, checkedAt: Date.now(), error: err.message };
    });
  }
  return globalThis.__relaunchStudioPgPool;
}

export function getLastPostgresError(): string | null {
  return globalThis.__relaunchStudioPgAvailable?.error || null;
}

/**
 * Fast cached check whether PostgreSQL is reachable.
 * Prevents local Windows dev (without Docker Postgres running) from waiting on timeouts.
 */
export async function isPostgresAvailable(): Promise<boolean> {
  const pool = getStudioPgPool();
  if (!pool) {
    globalThis.__relaunchStudioPgAvailable = {
      ok: false,
      checkedAt: Date.now(),
      error: "DATABASE_URL is not set in process.env",
    };
    return false;
  }

  const cached = globalThis.__relaunchStudioPgAvailable;
  if (cached && Date.now() - cached.checkedAt < 15000) {
    return cached.ok;
  }

  try {
    await pool.query("SELECT 1");
    globalThis.__relaunchStudioPgAvailable = { ok: true, checkedAt: Date.now() };
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    globalThis.__relaunchStudioPgAvailable = { ok: false, checkedAt: Date.now(), error: message };
    return false;
  }
}

export async function pgQuery<T extends QueryResultRow = Record<string, any>>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const pool = getStudioPgPool();
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function pgTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getStudioPgPool();
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

