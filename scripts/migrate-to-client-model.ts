/**
 * ReLaunch Studio — Idempotent Migration Script
 * Converts real brands -> active clients; fictional brands -> Samples/Concept space;
 * backfills client_id on ad_jobs, client_media_assets, and approved_deliverables.
 *
 * Usage: npx tsx scripts/migrate-to-client-model.ts
 */
import fs from "fs";
import path from "path";
import { SEED_CLIENTS, SEED_MEDIA_ASSETS } from "../src/lib/seedBrands";
import { getLastPostgresError, isPostgresAvailable, pgQuery, getStudioPgPool } from "../src/lib/studioDb";
import {
  createClientRecord,
  getClientById,
  listClients,
  matchClientForJob,
  setClientApprovedCreators,
  upsertApprovedDeliverable,
  upsertClientMediaAsset,
} from "../src/lib/clientStore";
import { getAllAdJobs, saveAdJob, type AdJob } from "../src/lib/adJob";
import type { ClientRecord } from "../src/types/client";

async function syncAdJobToPostgres(job: AdJob): Promise<void> {
  await pgQuery(
    `INSERT INTO ad_jobs (
      id, client_id, is_sample, brand_id, brand_name, creative_angle, hook_type, hook_text,
      creator_json, client_footage_url, ai_scene_json, scene_clips_json, script_json,
      variants_json, compliance_checks_json, ad_kit_draft_json, is_real_footage_dominant,
      has_synthetic_scenes, status, review_log_json, delivery_json, delivered_at, deleted_at,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13,
      $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23,
      $24, $25
    )
    ON CONFLICT (id) DO UPDATE SET
      client_id = COALESCE(EXCLUDED.client_id, ad_jobs.client_id),
      is_sample = EXCLUDED.is_sample,
      status = EXCLUDED.status,
      review_log_json = COALESCE(EXCLUDED.review_log_json, ad_jobs.review_log_json),
      delivery_json = COALESCE(EXCLUDED.delivery_json, ad_jobs.delivery_json),
      updated_at = EXCLUDED.updated_at`,
    [
      job.id,
      job.clientId || null,
      Boolean(job.isSample),
      job.brandId,
      job.brandName,
      job.creativeAngle,
      job.hookType,
      job.hookText,
      JSON.stringify(job.creator || {}),
      job.clientFootageUrl || "",
      JSON.stringify(job.aiScene || {}),
      JSON.stringify(job.sceneClips || {}),
      JSON.stringify(job.script || {}),
      JSON.stringify(job.variants || {}),
      JSON.stringify(job.complianceChecks || {}),
      job.adKitDraft ? JSON.stringify(job.adKitDraft) : null,
      job.isRealFootageDominant ?? true,
      job.hasSyntheticScenes ?? false,
      job.status,
      job.reviewLog ? JSON.stringify(job.reviewLog) : null,
      job.delivery ? JSON.stringify(job.delivery) : null,
      job.deliveredAt || job.delivery?.deliveredAt || null,
      job.deletedAt || null,
      job.createdAt || new Date().toISOString(),
      job.updatedAt || new Date().toISOString(),
    ]
  );
}

function loadDatabaseUrl(): { source: string; target: string } {
  const cliArg = process.argv.slice(2).find((arg) => arg.startsWith("--db=") || /^postgres(ql)?:\/\//i.test(arg));
  if (cliArg) {
    const val = cliArg.startsWith("--db=") ? cliArg.slice(5).trim() : cliArg.trim();
    if (val) {
      process.env.DATABASE_URL = val;
      return { source: "CLI argument", target: maskDatabaseUrl(val) };
    }
  }

  if (process.env.DATABASE_URL?.trim()) {
    return { source: "process.env", target: maskDatabaseUrl(process.env.DATABASE_URL.trim()) };
  }

  for (const envFile of [".env.local", ".env"]) {
    const fullPath = path.resolve(process.cwd(), envFile);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key === "DATABASE_URL" && val) {
        process.env.DATABASE_URL = val;
        return { source: envFile, target: maskDatabaseUrl(val) };
      }
    }
  }

  return { source: "none", target: "NOT SET" };
}

function maskDatabaseUrl(raw: string): string {
  try {
    const u = new URL(raw);
    return `${u.protocol}//${u.username ? `${u.username}:***@` : ""}${u.hostname}${u.port ? `:${u.port}` : ""}${u.pathname}`;
  } catch {
    return "configured (custom format)";
  }
}

async function run() {
  console.log("=== ReLaunch Studio Client Model Migration ===");
  const dbCfg = loadDatabaseUrl();
  console.log(`DATABASE_URL (${dbCfg.source}): ${dbCfg.target}`);
  const pgUp = await isPostgresAvailable();
  console.log(`Target store: ${pgUp ? "PostgreSQL 16 (+ local JSON mirror)" : "Local JSON Fallback (PostgreSQL not reachable)"}`);
  if (!pgUp) {
    const pgErr = getLastPostgresError();
    if (pgErr) console.log(`PostgreSQL detail: ${pgErr}`);
  }

  if (pgUp) {
    const pool = getStudioPgPool();
    const initSqlPath = path.resolve(process.cwd(), "relaunch-studio-engine/db/init.sql");
    if (fs.existsSync(initSqlPath)) {
      console.log("Applying base schema relaunch-studio-engine/db/init.sql...");
      const initSql = fs.readFileSync(initSqlPath, "utf8");
      await pool!.query(initSql);
    }

    const migrationPath = path.resolve(
      process.cwd(),
      "relaunch-studio-engine/db/migrations/002_client_model_and_footage_trimmer.sql"
    );
    if (fs.existsSync(migrationPath)) {
      console.log("Applying SQL migration 002_client_model_and_footage_trimmer.sql...");
      const sql = fs.readFileSync(migrationPath, "utf8");
      await pool!.query(sql);
      console.log("SQL migration applied successfully.");
    }
  }

  // 1. Ensure all SEED_CLIENTS exist
  let realCount = 0;
  let sampleCount = 0;
  for (const seed of SEED_CLIENTS) {
    let client = await getClientById(seed.slug);
    if (!client) {
      client = await createClientRecord({
        name: seed.name,
        slug: seed.slug,
        status: seed.status,
        contactName: seed.contactName,
        contactEmail: seed.contactEmail,
        website: seed.website,
        logoUrl: seed.logoUrl,
        isSample: seed.isSample,
        brandProfile: seed.brandProfile,
      });
      if (seed.suggestedCreators?.length) {
        await setClientApprovedCreators(client.id, seed.suggestedCreators);
      }
      console.log(`  + Created ${seed.isSample ? "Sample" : "Client"}: ${client.name} (${client.slug})`);
    } else {
      console.log(`  = Exists ${seed.isSample ? "Sample" : "Client"}: ${client.name} (${client.slug})`);
    }
    if (seed.isSample) sampleCount++;
    else realCount++;
  }

  // 2. Seed baseline + custom brand-assets.json assets
  const allClients: ClientRecord[] = [...(await listClients({ includeSamples: true }))];
  const clientBySlug = new Map(allClients.map((c) => [c.slug, c]));

  for (const asset of SEED_MEDIA_ASSETS) {
    const client = clientBySlug.get(asset.clientSlug);
    if (!client) continue;
    await upsertClientMediaAsset({
      id: asset.id,
      clientId: client.id,
      brandSlug: client.slug,
      brandName: client.name,
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

  const brandAssetsPath = path.resolve(process.cwd(), "public/storage/brands/brand-assets.json");
  if (fs.existsSync(brandAssetsPath)) {
    try {
      const customAssets = JSON.parse(fs.readFileSync(brandAssetsPath, "utf8"));
      if (Array.isArray(customAssets)) {
        for (const rawAsset of customAssets) {
          let owner =
            allClients.find((c) => c.slug === rawAsset.brandSlug) ||
            matchClientForJob(allClients, { brandId: rawAsset.brandSlug || "", brandName: rawAsset.brandName || "" });
          if (!owner && rawAsset.brandName) {
            owner = await createClientRecord({
              name: rawAsset.brandName,
              slug: rawAsset.brandSlug,
              status: "active",
              isSample: false,
            });
            allClients.push(owner);
          }
          if (owner) {
            await upsertClientMediaAsset({
              id: rawAsset.id,
              clientId: owner.id,
              brandSlug: owner.slug,
              brandName: owner.name,
              title: rawAsset.title || "Brand Media Asset",
              category: rawAsset.category || "product-demo",
              targetScene: rawAsset.targetScene === 3 ? 3 : 2,
              src: rawAsset.src,
              durationSeconds: rawAsset.durationSeconds,
              fileSizeMb: rawAsset.fileSizeMb,
              status: rawAsset.status === "deleted" ? "deleted" : "active",
              deletedAt: rawAsset.deletedAt,
              uploadedAt: rawAsset.uploadedAt || new Date().toISOString(),
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not migrate brand-assets.json:", err);
    }
  }

  // 3. Backfill ad-jobs.json with clientId & isSample (and sync to Postgres if running)
  const jobs = getAllAdJobs(true);
  let backfilledJobs = 0;
  let orphanJobs = 0;

  for (const job of jobs) {
    if (!job.clientId) {
      let owner = matchClientForJob(allClients, job);
      if (!owner && job.brandName) {
        owner = await createClientRecord({
          name: job.brandName,
          slug: job.brandId,
          status: "active",
          isSample: false,
        });
        allClients.push(owner);
      }
      if (owner) {
        job.clientId = owner.id;
        job.isSample = owner.isSample;
        saveAdJob(job);
        backfilledJobs++;
      } else {
        orphanJobs++;
      }
    }

    if (pgUp) {
      await syncAdJobToPostgres(job);
    }

    if (job.status === "approved" && job.clientId && !job.isSample) {
      await upsertApprovedDeliverable({
        clientId: job.clientId,
        adJobId: job.id,
        isSample: false,
        variants: job.variants || {},
        driveFolderId: job.delivery?.googleDriveFolderId,
        driveFileIds: job.delivery?.googleDriveFileIds,
        approvedBy: job.reviewLog?.reviewerName || "Creative Director",
        approvedAt: job.reviewLog?.approvedAt || job.updatedAt,
        deliveredAt: job.delivery?.deliveredAt,
      });
    }
  }

  console.log(`Migration summary:`);
  console.log(`  Real Clients: ${realCount}`);
  console.log(`  Sample Brands: ${sampleCount}`);
  console.log(`  Total Ad Jobs scanned: ${jobs.length} (${backfilledJobs} newly linked, ${orphanJobs} unlinked)`);
  console.log("=== Done ===");

  const pool = getStudioPgPool();
  if (pool) await pool.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
