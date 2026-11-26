import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isPostgresAvailable, pgQuery } from "@/lib/studioDb";
import { SEED_CLIENTS, SEED_MEDIA_ASSETS } from "@/lib/seedBrands";
import { getAllAdJobs, saveAdJob, type AdJob } from "@/lib/adJob";
import {
  BrandProfileSchema,
  slugifyClientName,
  type ApprovedDeliverableRecord,
  type BrandProfile,
  type BrandProfileInput,
  type ClientAdsBreakdown,
  type ClientApprovedCreator,
  type ClientClip,
  type ClientMediaAsset,
  type ClientRawFootage,
  type ClientRecord,
  type ClientStatus,
  type ClientSummary,
  type RawFootageStatus,
  type ReviewLinkRecord,
  type SceneRole,
} from "@/types/client";

const STORE_FILE = path.resolve(process.cwd(), "public/storage/studio-clients-db.json");

interface LocalClientDb {
  clients: ClientRecord[];
  approvedCreators: ClientApprovedCreator[];
  rawFootage: ClientRawFootage[];
  clips: ClientClip[];
  mediaAssets: ClientMediaAsset[];
  reviewLinks: ReviewLinkRecord[];
  approvedDeliverables: ApprovedDeliverableRecord[];
}

function defaultLocalDb(): LocalClientDb {
  return {
    clients: [],
    approvedCreators: [],
    rawFootage: [],
    clips: [],
    mediaAssets: [],
    reviewLinks: [],
    approvedDeliverables: [],
  };
}

function readLocalDb(): LocalClientDb {
  let db = defaultLocalDb();
  let needsSave = false;

  try {
    if (fs.existsSync(STORE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
      db = {
        clients: Array.isArray(parsed.clients) ? parsed.clients : [],
        approvedCreators: Array.isArray(parsed.approvedCreators) ? parsed.approvedCreators : [],
        rawFootage: Array.isArray(parsed.rawFootage) ? parsed.rawFootage : [],
        clips: Array.isArray(parsed.clips) ? parsed.clips : [],
        mediaAssets: Array.isArray(parsed.mediaAssets) ? parsed.mediaAssets : [],
        reviewLinks: Array.isArray(parsed.reviewLinks) ? parsed.reviewLinks : [],
        approvedDeliverables: Array.isArray(parsed.approvedDeliverables) ? parsed.approvedDeliverables : [],
      };
    } else {
      needsSave = true;
    }
  } catch (err) {
    console.warn("[ClientStore] Error reading local DB, reinitializing:", err);
    needsSave = true;
  }

  // Auto-seed canonical real & sample clients if empty
  if (db.clients.length === 0) {
    const now = new Date().toISOString();
    for (const seed of SEED_CLIENTS) {
      const clientId = crypto.randomUUID();
      db.clients.push({
        id: clientId,
        name: seed.name,
        slug: seed.slug,
        status: seed.status,
        contactName: seed.contactName,
        contactEmail: seed.contactEmail,
        contactPhone: "",
        website: seed.website,
        brandProfile: BrandProfileSchema.parse(seed.brandProfile),
        logoUrl: seed.logoUrl,
        brandAssetsRef: "",
        isSample: seed.isSample,
        lastActivityAt: now,
        createdAt: now,
        updatedAt: now,
      });

      for (const creatorSlug of seed.suggestedCreators || []) {
        db.approvedCreators.push({
          id: crypto.randomUUID(),
          clientId,
          creatorSlug,
          isApproved: true,
          timesUsed: 0,
          createdAt: now,
        });
      }
    }

    const clientBySlug = new Map(db.clients.map((c) => [c.slug, c]));
    for (const asset of SEED_MEDIA_ASSETS) {
      const owner = clientBySlug.get(asset.clientSlug);
      if (!owner) continue;
      db.mediaAssets.push({
        id: asset.id,
        clientId: owner.id,
        brandSlug: owner.slug,
        brandName: owner.name,
        title: asset.title,
        category: asset.category,
        targetScene: asset.targetScene,
        src: asset.src,
        durationSeconds: asset.durationSeconds,
        fileSizeMb: asset.fileSizeMb,
        status: asset.status || "active",
        uploadedAt: asset.uploadedAt,
      });
    }

    // Backfill clientId on existing ad-jobs.json entries
    const jobs = getAllAdJobs(true);
    for (const job of jobs) {
      if (!job.clientId) {
        const match = matchClientForJob(db.clients, job);
        if (match) {
          job.clientId = match.id;
          job.isSample = match.isSample;
          saveAdJob(job);
        }
      }
    }

    needsSave = true;
  }

  if (needsSave) {
    writeLocalDb(db);
  }
  return db;
}

function writeLocalDb(db: LocalClientDb): void {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("[ClientStore] Failed writing local DB:", err);
  }
}

export function matchClientForJob(clients: ClientRecord[], job: Pick<AdJob, "brandId" | "brandName">): ClientRecord | undefined {
  const bId = (job.brandId || "").toLowerCase();
  const bSlug = slugifyClientName(job.brandName || "");

  for (const seed of SEED_CLIENTS) {
    if (seed.legacyBrandIds.includes(bId) || seed.legacyBrandIds.includes(bSlug) || seed.slug === bId || seed.slug === bSlug) {
      const found = clients.find((c) => c.slug === seed.slug);
      if (found) return found;
    }
  }

  return (
    clients.find((c) => c.slug === bId || c.slug === bSlug) ||
    clients.find((c) => c.name.toLowerCase() === (job.brandName || "").toLowerCase())
  );
}

function mapPgClientRow(row: any): ClientRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || slugifyClientName(row.name),
    status: (row.status || "active") as ClientStatus,
    contactName: row.contact_name || "",
    contactEmail: row.contact_email || "",
    contactPhone: row.contact_phone || "",
    website: row.website || row.brand_profile_json?.website || "",
    brandProfile: BrandProfileSchema.parse(row.brand_profile_json || {}),
    logoUrl: row.logo_url || "",
    brandAssetsRef: row.brand_assets_ref || "",
    isSample: Boolean(row.is_sample),
    lastActivityAt: row.last_activity_at ? new Date(row.last_activity_at).toISOString() : new Date(row.updated_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function computeAdsBreakdown(jobs: AdJob[]): ClientAdsBreakdown {
  const breakdown: ClientAdsBreakdown = {
    draft: 0,
    generating: 0,
    inReview: 0,
    approved: 0,
    delivered: 0,
    total: 0,
  };
  for (const job of jobs) {
    if (job.status === "deleted") continue;
    breakdown.total += 1;
    if (job.status === "draft") breakdown.draft += 1;
    else if (job.status === "queued" || job.status === "rendering") breakdown.generating += 1;
    else if (job.status === "needs_review" || job.status === "recut") breakdown.inReview += 1;
    else if (job.status === "approved") {
      if (job.delivery?.status === "delivered" || job.deliveredAt) {
        breakdown.delivered += 1;
      } else {
        breakdown.approved += 1;
      }
    } else if (job.status === "delivered") {
      breakdown.delivered += 1;
    }
  }
  return breakdown;
}

// ============================================================================
// CLIENTS CRUD & SUMMARIES
// ============================================================================

export async function listClients(opts?: {
  includeSamples?: boolean;
  onlySamples?: boolean;
  status?: string;
  search?: string;
}): Promise<ClientSummary[]> {
  const usePg = await isPostgresAvailable();
  const jobs = getAllAdJobs(false);

  if (usePg) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (opts?.onlySamples) {
      conditions.push("is_sample = TRUE");
    } else if (!opts?.includeSamples) {
      conditions.push("is_sample = FALSE");
    }
    if (opts?.status && opts.status !== "all") {
      params.push(opts.status);
      conditions.push(`status = $${params.length}`);
    }
    if (opts?.search?.trim()) {
      params.push(`%${opts.search.trim().toLowerCase()}%`);
      conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(slug) LIKE $${params.length})`);
    }
    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await pgQuery(
      `SELECT * FROM clients ${whereSql} ORDER BY is_sample ASC, last_activity_at DESC, name ASC`,
      params
    );

    const rawCounts = await pgQuery<{ client_id: string; cnt: string }>(
      `SELECT client_id, COUNT(*)::text AS cnt FROM client_raw_footage GROUP BY client_id`
    );
    const clipCounts = await pgQuery<{ client_id: string; cnt: string }>(
      `SELECT client_id, COUNT(*)::text AS cnt FROM client_clips WHERE status = 'active' GROUP BY client_id`
    );
    const mediaCounts = await pgQuery<{ client_id: string; cnt: string }>(
      `SELECT client_id, COUNT(*)::text AS cnt FROM client_media_assets WHERE status = 'active' GROUP BY client_id`
    );

    const rawMap = new Map(rawCounts.map((r) => [r.client_id, Number(r.cnt)]));
    const clipMap = new Map(clipCounts.map((r) => [r.client_id, Number(r.cnt)]));
    const mediaMap = new Map(mediaCounts.map((r) => [r.client_id, Number(r.cnt)]));

    return rows.map((row) => {
      const rec = mapPgClientRow(row);
      const clientJobs = jobs.filter(
        (j) => j.clientId === rec.id || (!j.clientId && slugifyClientName(j.brandName) === rec.slug)
      );
      return {
        ...rec,
        rawFootageCount: rawMap.get(rec.id) || 0,
        clipCount: clipMap.get(rec.id) || 0,
        mediaAssetCount: mediaMap.get(rec.id) || 0,
        adsCount: computeAdsBreakdown(clientJobs),
      };
    });
  }

  const db = readLocalDb();
  let clients = [...db.clients];
  if (opts?.onlySamples) {
    clients = clients.filter((c) => c.isSample);
  } else if (!opts?.includeSamples) {
    clients = clients.filter((c) => !c.isSample);
  }
  if (opts?.status && opts.status !== "all") {
    clients = clients.filter((c) => c.status === opts.status);
  }
  if (opts?.search?.trim()) {
    const q = opts.search.trim().toLowerCase();
    clients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.brandProfile.category.toLowerCase().includes(q)
    );
  }

  clients.sort(
    (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  );

  return clients.map((rec) => {
    const rawFootageCount = db.rawFootage.filter((r) => r.clientId === rec.id).length;
    const clipCount = db.clips.filter((cl) => cl.clientId === rec.id && cl.status === "active").length;
    const mediaAssetCount = db.mediaAssets.filter((m) => m.clientId === rec.id && m.status === "active").length;
    const clientJobs = jobs.filter(
      (j) => j.clientId === rec.id || (!j.clientId && slugifyClientName(j.brandName) === rec.slug)
    );
    return {
      ...rec,
      rawFootageCount,
      clipCount,
      mediaAssetCount,
      adsCount: computeAdsBreakdown(clientJobs),
    };
  });
}

export async function getClientById(idOrSlug: string): Promise<ClientRecord | null> {
  const key = (idOrSlug || "").trim();
  if (!key) return null;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
    const rows = await pgQuery(
      isUuid
        ? `SELECT * FROM clients WHERE id = $1 LIMIT 1`
        : `SELECT * FROM clients WHERE slug = $1 LIMIT 1`,
      [key]
    );
    return rows[0] ? mapPgClientRow(rows[0]) : null;
  }

  const db = readLocalDb();
  return db.clients.find((c) => c.id === key || c.slug === key) || null;
}

export async function createClientRecord(input: {
  name: string;
  slug?: string;
  status?: ClientStatus;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  logoUrl?: string;
  brandAssetsRef?: string;
  isSample?: boolean;
  brandProfile?: BrandProfileInput;
}): Promise<ClientRecord> {
  const baseSlug = slugifyClientName(input.slug || input.name);
  const profile = BrandProfileSchema.parse(input.brandProfile || {});
  if (input.website && !profile.website) profile.website = input.website;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    // Ensure unique slug
    let slug = baseSlug;
    const existing = await pgQuery(`SELECT slug FROM clients WHERE slug LIKE $1`, [`${baseSlug}%`]);
    if (existing.some((r) => r.slug === slug)) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    const rows = await pgQuery(
      `INSERT INTO clients (
        name, slug, status, contact_name, contact_email, contact_phone,
        website, brand_profile_json, logo_url, brand_assets_ref, is_sample, last_activity_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *`,
      [
        input.name.trim(),
        slug,
        input.status || "prospect",
        input.contactName || "",
        input.contactEmail || "",
        input.contactPhone || "",
        input.website || profile.website || "",
        JSON.stringify(profile),
        input.logoUrl || "",
        input.brandAssetsRef || "",
        Boolean(input.isSample),
      ]
    );
    return mapPgClientRow(rows[0]);
  }

  const db = readLocalDb();
  let slug = baseSlug;
  if (db.clients.some((c) => c.slug === slug)) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  const now = new Date().toISOString();
  const record: ClientRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    slug,
    status: input.status || "prospect",
    contactName: input.contactName || "",
    contactEmail: input.contactEmail || "",
    contactPhone: input.contactPhone || "",
    website: input.website || profile.website || "",
    brandProfile: profile,
    logoUrl: input.logoUrl || "",
    brandAssetsRef: input.brandAssetsRef || "",
    isSample: Boolean(input.isSample),
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  };
  db.clients.push(record);
  writeLocalDb(db);
  return record;
}

export async function updateClientRecord(
  id: string,
  updates: Partial<{
    name: string;
    slug: string;
    status: ClientStatus;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
    brandAssetsRef: string;
    isSample: boolean;
    brandProfile: BrandProfileInput;
  }>
): Promise<ClientRecord | null> {
  const existing = await getClientById(id);
  if (!existing) return null;

  const mergedProfile = updates.brandProfile
    ? BrandProfileSchema.parse({ ...existing.brandProfile, ...updates.brandProfile })
    : existing.brandProfile;

  const nextName = updates.name !== undefined ? updates.name.trim() : existing.name;
  const nextSlug = updates.slug !== undefined ? slugifyClientName(updates.slug) : existing.slug;
  const nextStatus = updates.status ?? existing.status;
  const nextContactName = updates.contactName ?? existing.contactName;
  const nextContactEmail = updates.contactEmail ?? existing.contactEmail;
  const nextContactPhone = updates.contactPhone ?? existing.contactPhone;
  const nextWebsite = updates.website ?? existing.website;
  const nextLogoUrl = updates.logoUrl ?? existing.logoUrl;
  const nextBrandAssetsRef = updates.brandAssetsRef ?? existing.brandAssetsRef;
  const nextIsSample = updates.isSample !== undefined ? updates.isSample : existing.isSample;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `UPDATE clients SET
        name = $2,
        slug = $3,
        status = $4,
        contact_name = $5,
        contact_email = $6,
        contact_phone = $7,
        website = $8,
        brand_profile_json = $9,
        logo_url = $10,
        brand_assets_ref = $11,
        is_sample = $12,
        last_activity_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [
        existing.id,
        nextName,
        nextSlug,
        nextStatus,
        nextContactName,
        nextContactEmail,
        nextContactPhone,
        nextWebsite,
        JSON.stringify(mergedProfile),
        nextLogoUrl,
        nextBrandAssetsRef,
        nextIsSample,
      ]
    );
    return rows[0] ? mapPgClientRow(rows[0]) : null;
  }

  const db = readLocalDb();
  const idx = db.clients.findIndex((c) => c.id === existing.id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: ClientRecord = {
    ...db.clients[idx],
    name: nextName,
    slug: nextSlug,
    status: nextStatus,
    contactName: nextContactName,
    contactEmail: nextContactEmail,
    contactPhone: nextContactPhone,
    website: nextWebsite,
    brandProfile: mergedProfile,
    logoUrl: nextLogoUrl,
    brandAssetsRef: nextBrandAssetsRef,
    isSample: nextIsSample,
    lastActivityAt: now,
    updatedAt: now,
  };
  db.clients[idx] = updated;
  writeLocalDb(db);
  return updated;
}

export async function touchClientActivity(clientId: string): Promise<void> {
  if (!clientId) return;
  const usePg = await isPostgresAvailable();
  if (usePg) {
    await pgQuery(`UPDATE clients SET last_activity_at = NOW() WHERE id = $1`, [clientId]);
    return;
  }
  const db = readLocalDb();
  const client = db.clients.find((c) => c.id === clientId);
  if (client) {
    client.lastActivityAt = new Date().toISOString();
    client.updatedAt = client.lastActivityAt;
    writeLocalDb(db);
  }
}

// ============================================================================
// APPROVED CREATORS PER CLIENT
// ============================================================================

export async function listClientApprovedCreators(clientId: string): Promise<ClientApprovedCreator[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `SELECT * FROM client_approved_creators WHERE client_id = $1 ORDER BY is_approved DESC, times_used DESC, created_at ASC`,
      [clientId]
    );
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      creatorSlug: r.creator_slug,
      isApproved: Boolean(r.is_approved),
      timesUsed: Number(r.times_used || 0),
      lastUsedAt: r.last_used_at ? new Date(r.last_used_at).toISOString() : undefined,
      notes: r.notes || "",
      createdAt: new Date(r.created_at).toISOString(),
    }));
  }

  const db = readLocalDb();
  return db.approvedCreators
    .filter((c) => c.clientId === clientId)
    .sort((a, b) => Number(b.isApproved) - Number(a.isApproved) || b.timesUsed - a.timesUsed);
}

export async function setClientApprovedCreators(
  clientId: string,
  creatorSlugs: string[]
): Promise<ClientApprovedCreator[]> {
  const uniqueSlugs = Array.from(new Set(creatorSlugs.map((s) => s.trim()).filter(Boolean)));
  const usePg = await isPostgresAvailable();

  if (usePg) {
    await pgQuery(`UPDATE client_approved_creators SET is_approved = FALSE WHERE client_id = $1`, [clientId]);
    for (const slug of uniqueSlugs) {
      await pgQuery(
        `INSERT INTO client_approved_creators (client_id, creator_slug, is_approved)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (client_id, creator_slug)
         DO UPDATE SET is_approved = TRUE`,
        [clientId, slug]
      );
    }
    return listClientApprovedCreators(clientId);
  }

  const db = readLocalDb();
  const now = new Date().toISOString();
  for (const item of db.approvedCreators) {
    if (item.clientId === clientId) {
      item.isApproved = uniqueSlugs.includes(item.creatorSlug);
    }
  }
  for (const slug of uniqueSlugs) {
    if (!db.approvedCreators.some((item) => item.clientId === clientId && item.creatorSlug === slug)) {
      db.approvedCreators.push({
        id: crypto.randomUUID(),
        clientId,
        creatorSlug: slug,
        isApproved: true,
        timesUsed: 0,
        createdAt: now,
      });
    }
  }
  writeLocalDb(db);
  return listClientApprovedCreators(clientId);
}

export async function recordClientCreatorUsage(clientId: string, creatorSlug: string): Promise<void> {
  if (!clientId || !creatorSlug) return;
  const usePg = await isPostgresAvailable();
  if (usePg) {
    await pgQuery(
      `INSERT INTO client_approved_creators (client_id, creator_slug, is_approved, times_used, last_used_at)
       VALUES ($1, $2, TRUE, 1, NOW())
       ON CONFLICT (client_id, creator_slug)
       DO UPDATE SET times_used = client_approved_creators.times_used + 1, last_used_at = NOW()`,
      [clientId, creatorSlug]
    );
    return;
  }
  const db = readLocalDb();
  const now = new Date().toISOString();
  const existing = db.approvedCreators.find((c) => c.clientId === clientId && c.creatorSlug === creatorSlug);
  if (existing) {
    existing.timesUsed += 1;
    existing.lastUsedAt = now;
  } else {
    db.approvedCreators.push({
      id: crypto.randomUUID(),
      clientId,
      creatorSlug,
      isApproved: true,
      timesUsed: 1,
      lastUsedAt: now,
      createdAt: now,
    });
  }
  writeLocalDb(db);
}

// ============================================================================
// CLIENT RAW FOOTAGE (FEATURE 2)
// ============================================================================

function mapPgRawFootageRow(r: any): ClientRawFootage {
  return {
    id: r.id,
    clientId: r.client_id,
    storageUrl: r.storage_url,
    playableUrl: r.playable_url || undefined,
    spriteUrl: r.sprite_url || undefined,
    thumbnailUrl: r.thumbnail_url || undefined,
    filename: r.filename,
    duration: Number(r.duration || 0),
    mime: r.mime,
    codec: r.codec || undefined,
    width: r.width ? Number(r.width) : undefined,
    height: r.height ? Number(r.height) : undefined,
    fileSizeBytes: r.file_size_bytes ? Number(r.file_size_bytes) : undefined,
    status: (r.status || "raw") as RawFootageStatus,
    errorMessage: r.error_message || undefined,
    uploadedAt: new Date(r.uploaded_at).toISOString(),
  };
}

export async function listClientRawFootage(clientId: string): Promise<ClientRawFootage[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `SELECT * FROM client_raw_footage WHERE client_id = $1 ORDER BY uploaded_at DESC`,
      [clientId]
    );
    return rows.map(mapPgRawFootageRow);
  }
  const db = readLocalDb();
  return db.rawFootage
    .filter((r) => r.clientId === clientId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export async function getRawFootageById(rawId: string): Promise<ClientRawFootage | null> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(`SELECT * FROM client_raw_footage WHERE id = $1 LIMIT 1`, [rawId]);
    return rows[0] ? mapPgRawFootageRow(rows[0]) : null;
  }
  const db = readLocalDb();
  return db.rawFootage.find((r) => r.id === rawId) || null;
}

export async function createRawFootage(input: {
  id?: string;
  clientId: string;
  storageUrl: string;
  playableUrl?: string;
  filename: string;
  duration?: number;
  mime: string;
  fileSizeBytes?: number;
  status?: RawFootageStatus;
}): Promise<ClientRawFootage> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `INSERT INTO client_raw_footage (
        id, client_id, storage_url, playable_url, filename, duration, mime, file_size_bytes, status
      ) VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        input.id || null,
        input.clientId,
        input.storageUrl,
        input.playableUrl || null,
        input.filename,
        input.duration ?? 0,
        input.mime || "video/mp4",
        input.fileSizeBytes ?? null,
        input.status || "raw",
      ]
    );
    await touchClientActivity(input.clientId);
    return mapPgRawFootageRow(rows[0]);
  }

  const db = readLocalDb();
  const record: ClientRawFootage = {
    id: input.id || crypto.randomUUID(),
    clientId: input.clientId,
    storageUrl: input.storageUrl,
    playableUrl: input.playableUrl,
    filename: input.filename,
    duration: input.duration ?? 0,
    mime: input.mime || "video/mp4",
    fileSizeBytes: input.fileSizeBytes,
    status: input.status || "raw",
    uploadedAt: new Date().toISOString(),
  };
  db.rawFootage.push(record);
  writeLocalDb(db);
  await touchClientActivity(input.clientId);
  return record;
}

export async function updateRawFootage(
  rawId: string,
  updates: Partial<ClientRawFootage>
): Promise<ClientRawFootage | null> {
  const existing = await getRawFootageById(rawId);
  if (!existing) return null;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `UPDATE client_raw_footage SET
        storage_url = COALESCE($2, storage_url),
        playable_url = COALESCE($3, playable_url),
        sprite_url = COALESCE($4, sprite_url),
        thumbnail_url = COALESCE($5, thumbnail_url),
        duration = COALESCE($6, duration),
        codec = COALESCE($7, codec),
        width = COALESCE($8, width),
        height = COALESCE($9, height),
        status = COALESCE($10, status),
        error_message = $11
      WHERE id = $1
      RETURNING *`,
      [
        rawId,
        updates.storageUrl ?? null,
        updates.playableUrl ?? null,
        updates.spriteUrl ?? null,
        updates.thumbnailUrl ?? null,
        updates.duration ?? null,
        updates.codec ?? null,
        updates.width ?? null,
        updates.height ?? null,
        updates.status ?? null,
        updates.errorMessage ?? null,
      ]
    );
    return rows[0] ? mapPgRawFootageRow(rows[0]) : null;
  }

  const db = readLocalDb();
  const idx = db.rawFootage.findIndex((r) => r.id === rawId);
  if (idx === -1) return null;
  db.rawFootage[idx] = { ...db.rawFootage[idx], ...updates };
  writeLocalDb(db);
  return db.rawFootage[idx];
}

export async function deleteRawFootage(rawId: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(`DELETE FROM client_raw_footage WHERE id = $1 RETURNING id`, [rawId]);
    return rows.length > 0;
  }
  const db = readLocalDb();
  const before = db.rawFootage.length;
  db.rawFootage = db.rawFootage.filter((r) => r.id !== rawId);
  db.clips = db.clips.filter((c) => c.sourceRawId !== rawId);
  if (db.rawFootage.length !== before) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

// ============================================================================
// CLIENT VIRTUAL CLIPS (FEATURE 2)
// ============================================================================

function mapPgClipRow(r: any): ClientClip {
  return {
    id: r.id,
    clientId: r.client_id,
    sourceRawId: r.source_raw_id,
    inPoint: Number(r.in_point),
    outPoint: Number(r.out_point),
    sceneRole: r.scene_role as SceneRole,
    label: r.label,
    notes: r.notes || "",
    previewUrl: r.preview_url || undefined,
    thumbnailUrl: r.thumbnail_url || undefined,
    status: r.status || "active",
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
    sourceFilename: r.source_filename || undefined,
    sourcePlayableUrl: r.source_playable_url || undefined,
    sourceStorageUrl: r.source_storage_url || undefined,
    sourceSpriteUrl: r.source_sprite_url || undefined,
    sourceDuration: r.source_duration ? Number(r.source_duration) : undefined,
  };
}

export async function listClientClips(
  clientId: string,
  sceneRole?: SceneRole | "all"
): Promise<ClientClip[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const params: any[] = [clientId];
    let roleSql = "";
    if (sceneRole && sceneRole !== "all") {
      params.push(sceneRole);
      roleSql = `AND c.scene_role = $${params.length}`;
    }
    const rows = await pgQuery(
      `SELECT c.*,
              rf.filename AS source_filename,
              rf.playable_url AS source_playable_url,
              rf.storage_url AS source_storage_url,
              rf.sprite_url AS source_sprite_url,
              rf.duration AS source_duration
       FROM client_clips c
       JOIN client_raw_footage rf ON rf.id = c.source_raw_id
       WHERE c.client_id = $1 AND c.status = 'active' ${roleSql}
       ORDER BY c.created_at DESC`,
      params
    );
    return rows.map(mapPgClipRow);
  }

  const db = readLocalDb();
  const rawMap = new Map(db.rawFootage.map((r) => [r.id, r]));
  let clips = db.clips.filter((c) => c.clientId === clientId && c.status === "active");
  if (sceneRole && sceneRole !== "all") {
    clips = clips.filter((c) => c.sceneRole === sceneRole);
  }
  clips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return clips.map((c) => {
    const raw = rawMap.get(c.sourceRawId);
    return {
      ...c,
      sourceFilename: raw?.filename,
      sourcePlayableUrl: raw?.playableUrl,
      sourceStorageUrl: raw?.storageUrl,
      sourceSpriteUrl: raw?.spriteUrl,
      sourceDuration: raw?.duration,
    };
  });
}

export async function getClientClipById(clipId: string): Promise<ClientClip | null> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `SELECT c.*,
              rf.filename AS source_filename,
              rf.playable_url AS source_playable_url,
              rf.storage_url AS source_storage_url,
              rf.sprite_url AS source_sprite_url,
              rf.duration AS source_duration
       FROM client_clips c
       JOIN client_raw_footage rf ON rf.id = c.source_raw_id
       WHERE c.id = $1 LIMIT 1`,
      [clipId]
    );
    return rows[0] ? mapPgClipRow(rows[0]) : null;
  }

  const db = readLocalDb();
  const clip = db.clips.find((c) => c.id === clipId);
  if (!clip) return null;
  const raw = db.rawFootage.find((r) => r.id === clip.sourceRawId);
  return {
    ...clip,
    sourceFilename: raw?.filename,
    sourcePlayableUrl: raw?.playableUrl,
    sourceStorageUrl: raw?.storageUrl,
    sourceSpriteUrl: raw?.spriteUrl,
    sourceDuration: raw?.duration,
  };
}

export async function createClientClip(input: {
  id?: string;
  clientId: string;
  sourceRawId: string;
  inPoint: number;
  outPoint: number;
  sceneRole: SceneRole;
  label: string;
  notes?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
}): Promise<ClientClip> {
  const inPt = Number(Math.max(0, input.inPoint).toFixed(1));
  const outPt = Number(Math.max(inPt + 0.2, input.outPoint).toFixed(1));

  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `INSERT INTO client_clips (
        id, client_id, source_raw_id, in_point, out_point, scene_role, label, notes, preview_url, thumbnail_url
      ) VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        input.id || null,
        input.clientId,
        input.sourceRawId,
        inPt,
        outPt,
        input.sceneRole,
        input.label.trim(),
        (input.notes || "").trim(),
        input.previewUrl || null,
        input.thumbnailUrl || null,
      ]
    );
    await touchClientActivity(input.clientId);
    return (await getClientClipById(rows[0].id))!;
  }

  const db = readLocalDb();
  const now = new Date().toISOString();
  const clip: ClientClip = {
    id: input.id || crypto.randomUUID(),
    clientId: input.clientId,
    sourceRawId: input.sourceRawId,
    inPoint: inPt,
    outPoint: outPt,
    sceneRole: input.sceneRole,
    label: input.label.trim(),
    notes: (input.notes || "").trim(),
    previewUrl: input.previewUrl,
    thumbnailUrl: input.thumbnailUrl,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  db.clips.push(clip);
  writeLocalDb(db);
  await touchClientActivity(input.clientId);
  return (await getClientClipById(clip.id))!;
}

export async function updateClientClip(
  clipId: string,
  updates: Partial<{
    inPoint: number;
    outPoint: number;
    sceneRole: SceneRole;
    label: string;
    notes: string;
    previewUrl: string;
    thumbnailUrl: string;
    status: "active" | "deleted";
  }>
): Promise<ClientClip | null> {
  const existing = await getClientClipById(clipId);
  if (!existing) return null;

  const inPt = updates.inPoint !== undefined ? Number(Math.max(0, updates.inPoint).toFixed(1)) : existing.inPoint;
  const outPt = updates.outPoint !== undefined ? Number(Math.max(inPt + 0.2, updates.outPoint).toFixed(1)) : existing.outPoint;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    await pgQuery(
      `UPDATE client_clips SET
        in_point = $2,
        out_point = $3,
        scene_role = COALESCE($4, scene_role),
        label = COALESCE($5, label),
        notes = COALESCE($6, notes),
        preview_url = COALESCE($7, preview_url),
        thumbnail_url = COALESCE($8, thumbnail_url),
        status = COALESCE($9, status)
      WHERE id = $1`,
      [
        clipId,
        inPt,
        outPt,
        updates.sceneRole ?? null,
        updates.label?.trim() ?? null,
        updates.notes ?? null,
        updates.previewUrl ?? null,
        updates.thumbnailUrl ?? null,
        updates.status ?? null,
      ]
    );
    return getClientClipById(clipId);
  }

  const db = readLocalDb();
  const idx = db.clips.findIndex((c) => c.id === clipId);
  if (idx === -1) return null;
  db.clips[idx] = {
    ...db.clips[idx],
    ...updates,
    inPoint: inPt,
    outPoint: outPt,
    updatedAt: new Date().toISOString(),
  };
  writeLocalDb(db);
  return getClientClipById(clipId);
}

// ============================================================================
// LEGACY / SCENE-READY CLIENT MEDIA ASSETS
// ============================================================================

export async function listClientMediaAssets(opts?: {
  clientId?: string;
  includeDeleted?: boolean;
  includeSamples?: boolean;
}): Promise<ClientMediaAsset[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (opts?.clientId) {
      params.push(opts.clientId);
      conditions.push(`a.client_id = $${params.length}`);
    }
    if (!opts?.includeDeleted) {
      conditions.push(`a.status = 'active'`);
    }
    if (opts?.includeSamples === false) {
      conditions.push(`c.is_sample = FALSE`);
    }
    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await pgQuery(
      `SELECT a.*, c.slug AS brand_slug, c.name AS brand_name
       FROM client_media_assets a
       JOIN clients c ON c.id = a.client_id
       ${whereSql}
       ORDER BY a.uploaded_at DESC`,
      params
    );
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      brandSlug: r.brand_slug,
      brandName: r.brand_name,
      title: r.title,
      category: r.category,
      targetScene: Number(r.target_scene) as 2 | 3,
      src: r.src,
      durationSeconds: r.duration_seconds ? Number(r.duration_seconds) : undefined,
      fileSizeMb: r.file_size_mb ? Number(r.file_size_mb) : undefined,
      status: r.status,
      deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : undefined,
      uploadedAt: new Date(r.uploaded_at).toISOString(),
    }));
  }

  const db = readLocalDb();
  const clientMap = new Map(db.clients.map((c) => [c.id, c]));
  let list = [...db.mediaAssets];
  if (opts?.clientId) list = list.filter((a) => a.clientId === opts.clientId);
  if (!opts?.includeDeleted) list = list.filter((a) => a.status !== "deleted");
  if (opts?.includeSamples === false) {
    list = list.filter((a) => !clientMap.get(a.clientId)?.isSample);
  }
  return list.map((a) => {
    const c = clientMap.get(a.clientId);
    return {
      ...a,
      brandSlug: c?.slug || a.brandSlug,
      brandName: c?.name || a.brandName,
    };
  });
}

export async function upsertClientMediaAsset(asset: ClientMediaAsset): Promise<ClientMediaAsset> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    await pgQuery(
      `INSERT INTO client_media_assets (
        id, client_id, title, category, target_scene, src, duration_seconds, file_size_mb, status, deleted_at, uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        client_id = EXCLUDED.client_id,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        target_scene = EXCLUDED.target_scene,
        src = EXCLUDED.src,
        status = EXCLUDED.status,
        deleted_at = EXCLUDED.deleted_at`,
      [
        asset.id,
        asset.clientId,
        asset.title,
        asset.category,
        asset.targetScene,
        asset.src,
        asset.durationSeconds ?? null,
        asset.fileSizeMb ?? null,
        asset.status || "active",
        asset.deletedAt ?? null,
        asset.uploadedAt || new Date().toISOString(),
      ]
    );
    await touchClientActivity(asset.clientId);
    return asset;
  }

  const db = readLocalDb();
  const idx = db.mediaAssets.findIndex((a) => a.id === asset.id);
  if (idx >= 0) db.mediaAssets[idx] = asset;
  else db.mediaAssets.push(asset);
  writeLocalDb(db);
  await touchClientActivity(asset.clientId);
  return asset;
}

export async function deleteClientMediaAssetPermanently(id: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(`DELETE FROM client_media_assets WHERE id = $1 RETURNING id`, [id]);
    return rows.length > 0;
  }
  const db = readLocalDb();
  const before = db.mediaAssets.length;
  db.mediaAssets = db.mediaAssets.filter((a) => a.id !== id);
  if (db.mediaAssets.length !== before) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

// ============================================================================
// REVIEW LINKS & APPROVED DELIVERABLES
// ============================================================================

export async function listReviewLinks(clientId: string): Promise<ReviewLinkRecord[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `SELECT * FROM review_links WHERE client_id = $1 ORDER BY created_at DESC`,
      [clientId]
    );
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      adId: r.ad_id,
      label: r.label || "",
      shareToken: r.share_token,
      createdBy: r.created_by || "Studio Admin",
      expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : undefined,
      revokedAt: r.revoked_at ? new Date(r.revoked_at).toISOString() : undefined,
      lastViewedAt: r.last_viewed_at ? new Date(r.last_viewed_at).toISOString() : undefined,
      createdAt: new Date(r.created_at).toISOString(),
    }));
  }

  const db = readLocalDb();
  return db.reviewLinks
    .filter((l) => l.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createReviewLinkRecord(input: {
  clientId: string;
  adId: string;
  label?: string;
  shareToken: string;
  createdBy?: string;
  expiresAt?: string;
}): Promise<ReviewLinkRecord> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `INSERT INTO review_links (client_id, ad_id, label, share_token, created_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.clientId,
        input.adId,
        input.label || "",
        input.shareToken,
        input.createdBy || "Studio Admin",
        input.expiresAt || null,
      ]
    );
    const r = rows[0];
    return {
      id: r.id,
      clientId: r.client_id,
      adId: r.ad_id,
      label: r.label || "",
      shareToken: r.share_token,
      createdBy: r.created_by || "Studio Admin",
      expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : undefined,
      revokedAt: r.revoked_at ? new Date(r.revoked_at).toISOString() : undefined,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  const db = readLocalDb();
  const record: ReviewLinkRecord = {
    id: crypto.randomUUID(),
    clientId: input.clientId,
    adId: input.adId,
    label: input.label || "",
    shareToken: input.shareToken,
    createdBy: input.createdBy || "Studio Admin",
    expiresAt: input.expiresAt,
    createdAt: new Date().toISOString(),
  };
  db.reviewLinks.push(record);
  writeLocalDb(db);
  return record;
}

export async function revokeReviewLinkRecord(linkId: string): Promise<boolean> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `UPDATE review_links SET revoked_at = NOW() WHERE id = $1 RETURNING id`,
      [linkId]
    );
    return rows.length > 0;
  }
  const db = readLocalDb();
  const link = db.reviewLinks.find((l) => l.id === linkId);
  if (!link) return false;
  link.revokedAt = new Date().toISOString();
  writeLocalDb(db);
  return true;
}

export async function isShareTokenRevoked(adId: string, shareToken: string): Promise<boolean> {
  if (!adId || !shareToken) return false;
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery<{ revoked_at: string | null }>(
      `SELECT revoked_at FROM review_links WHERE ad_id = $1 AND share_token = $2 ORDER BY created_at DESC LIMIT 1`,
      [adId, shareToken]
    );
    if (rows.length > 0 && rows[0].revoked_at) return true;
    return false;
  }
  const db = readLocalDb();
  const match = db.reviewLinks.find((l) => l.adId === adId && l.shareToken === shareToken);
  return Boolean(match?.revokedAt);
}

export async function upsertApprovedDeliverable(input: {
  clientId: string;
  adJobId: string;
  isSample: boolean;
  variants: Record<string, string | undefined>;
  driveFolderId?: string;
  driveFileIds?: Record<string, string | undefined>;
  approvedBy: string;
  approvedAt: string;
  deliveredAt?: string;
}): Promise<ApprovedDeliverableRecord | null> {
  // Fictional sample brands are never stored as Approved client deliverables
  if (input.isSample) return null;

  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = await pgQuery(
      `INSERT INTO approved_deliverables (
        client_id, ad_job_id, is_sample, variants_json, drive_folder_id, drive_file_ids_json, approved_by, approved_at, delivered_at
      ) VALUES ($1, $2, FALSE, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ad_job_id) DO UPDATE SET
        variants_json = EXCLUDED.variants_json,
        drive_folder_id = COALESCE(EXCLUDED.drive_folder_id, approved_deliverables.drive_folder_id),
        drive_file_ids_json = COALESCE(EXCLUDED.drive_file_ids_json, approved_deliverables.drive_file_ids_json),
        approved_by = EXCLUDED.approved_by,
        approved_at = EXCLUDED.approved_at,
        delivered_at = COALESCE(EXCLUDED.delivered_at, approved_deliverables.delivered_at)
      RETURNING *`,
      [
        input.clientId,
        input.adJobId,
        JSON.stringify(input.variants || {}),
        input.driveFolderId || null,
        JSON.stringify(input.driveFileIds || {}),
        input.approvedBy,
        input.approvedAt,
        input.deliveredAt || null,
      ]
    );
    const r = rows[0];
    return {
      id: r.id,
      clientId: r.client_id,
      adJobId: r.ad_job_id,
      isSample: false,
      variants: r.variants_json || {},
      driveFolderId: r.drive_folder_id || undefined,
      driveFileIds: r.drive_file_ids_json || undefined,
      zipPackageUrl: r.zip_package_url || undefined,
      approvedBy: r.approved_by,
      approvedAt: new Date(r.approved_at).toISOString(),
      deliveredAt: r.delivered_at ? new Date(r.delivered_at).toISOString() : undefined,
    };
  }

  const db = readLocalDb();
  const idx = db.approvedDeliverables.findIndex((d) => d.adJobId === input.adJobId);
  const record: ApprovedDeliverableRecord = {
    id: idx >= 0 ? db.approvedDeliverables[idx].id : crypto.randomUUID(),
    clientId: input.clientId,
    adJobId: input.adJobId,
    isSample: false,
    variants: input.variants || {},
    driveFolderId: input.driveFolderId,
    driveFileIds: input.driveFileIds,
    approvedBy: input.approvedBy,
    approvedAt: input.approvedAt,
    deliveredAt: input.deliveredAt,
  };
  if (idx >= 0) db.approvedDeliverables[idx] = record;
  else db.approvedDeliverables.push(record);
  writeLocalDb(db);
  return record;
}

export async function listApprovedDeliverables(clientId?: string): Promise<ApprovedDeliverableRecord[]> {
  const usePg = await isPostgresAvailable();
  if (usePg) {
    const rows = clientId
      ? await pgQuery(
          `SELECT * FROM approved_deliverables WHERE client_id = $1 AND is_sample = FALSE ORDER BY approved_at DESC`,
          [clientId]
        )
      : await pgQuery(
          `SELECT * FROM approved_deliverables WHERE is_sample = FALSE ORDER BY approved_at DESC`
        );
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      adJobId: r.ad_job_id,
      isSample: Boolean(r.is_sample),
      variants: r.variants_json || {},
      driveFolderId: r.drive_folder_id || undefined,
      driveFileIds: r.drive_file_ids_json || undefined,
      zipPackageUrl: r.zip_package_url || undefined,
      approvedBy: r.approved_by,
      approvedAt: new Date(r.approved_at).toISOString(),
      deliveredAt: r.delivered_at ? new Date(r.delivered_at).toISOString() : undefined,
    }));
  }

  const db = readLocalDb();
  return db.approvedDeliverables
    .filter((d) => !d.isSample && (!clientId || d.clientId === clientId))
    .sort((a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime());
}
