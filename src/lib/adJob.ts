/**
 * ReLaunch Studio — Unified "Ad Job" Data Model & Store
 * 
 * Central schema linking the Generator, Render Worker, Review Gate, and Delivery.
 * Runs seamlessly on local dev (in-memory + local JSON fallback) or PostgreSQL 16 on VPS.
 */

export type AdJobStatus =
  | 'draft'
  | 'queued'
  | 'rendering'
  | 'needs_review'
  | 'approved'
  | 'rejected'
  | 'recut'
  | 'delivered'
  | 'deleted';

export interface AdJobComplianceChecks {
  creatorVerification: boolean;    // Real UGC / creator hook verified
  scriptClaims: boolean;           // No misleading or unsubstantiated claims
  clientFootagePresent: boolean;   // Authentic client product/location footage confirmed
  disclosureState: boolean;        // AI disclosure badge confirmed burned into media
  creativeDirectorSignOff?: boolean; // Human Creative Director taste gate sign-off
  cdSignOffNotes?: string;         // Creative Director editorial notes
}

export interface AdJob {
  id: string;
  brandId: string;
  brandName: string;
  creativeAngle: string;
  hookType: 'problem' | 'question' | 'testimonial' | 'curiosity' | 'listicle';
  hookText: string;
  creator: {
    id: string;
    name: string;
    handle?: string;
    hookClipUrl: string;           // 0–3s UGC/sample creator hook
  };
  clientFootageUrl: string;        // 3–15s raw client footage
  aiScene: {
    prompt: string;                // Grok Imagine prompt
    model: string;                 // 'grok-1.5' default
    durationSeconds: number;       // 7s (15–22s timeline segment)
    clipUrl?: string;              // Rendered Grok MP4 in R2
  };
  script: {
    body: string;
    ctaText: string;
    voiceId: string;
    voiceoverUrl?: string;
    wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  };
  variants: {
    v9x16?: string;
    v1x1?: string;
    v4x5?: string;
    thumbnail?: string;
    v4k?: string;
    vClean?: string;
    stemVo?: string;
    stemMusic?: string;
  };
  complianceChecks: AdJobComplianceChecks;
  status: AdJobStatus;
  reviewLog?: {
    reviewerName: string;
    decision: 'approve' | 'reject' | 'recut';
    notes?: string;
    approvedAt: string;
  };
  delivery?: {
    googleDriveFolderId?: string;
    googleDriveFileIds?: {
      v9x16?: string;
      v1x1?: string;
      v4x5?: string;
    };
    deliveredAt?: string;
    status: 'pending' | 'delivered' | 'failed';
  };
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

import fs from "fs";
import path from "path";

const JOBS_FILE = path.resolve(process.cwd(), "public/storage/ad-jobs.json");

function loadJobsFromFile(): Map<string, AdJob> {
  const store = new Map<string, AdJob>();
  try {
    if (fs.existsSync(JOBS_FILE)) {
      const data = JSON.parse(fs.readFileSync(JOBS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        for (const job of data) {
          if (job?.id) store.set(job.id, job);
        }
      }
    }
  } catch (err) {
    console.error("Error loading ad-jobs.json:", err);
  }
  return store;
}

function saveJobsToFile(store: Map<string, AdJob>): void {
  try {
    const dir = path.dirname(JOBS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(JOBS_FILE, JSON.stringify(Array.from(store.values()), null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing ad-jobs.json:", err);
  }
}

export function getAllAdJobs(includeDeleted = false): AdJob[] {
  const store = loadJobsFromFile();
  const all = Array.from(store.values());
  if (includeDeleted) return all;
  return all.filter((job) => job.status !== 'deleted');
}

export function getDeletedAdJobs(): AdJob[] {
  const store = loadJobsFromFile();
  return Array.from(store.values())
    .filter((job) => job.status === 'deleted')
    .sort((a, b) => new Date(b.deletedAt || b.updatedAt).getTime() - new Date(a.deletedAt || a.updatedAt).getTime());
}

export function getAdJobById(id: string): AdJob | null {
  const store = loadJobsFromFile();
  return store.get(id) || null;
}

export function saveAdJob(job: AdJob): AdJob {
  const store = loadJobsFromFile();
  job.updatedAt = new Date().toISOString();
  store.set(job.id, job);
  saveJobsToFile(store);
  return job;
}

export function clearAllAdJobs(): void {
  softDeleteAllAdJobs();
}

export function softDeleteAdJobs(ids: string[]): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  const now = new Date().toISOString();
  for (const id of ids) {
    const job = store.get(id);
    if (job && job.status !== 'deleted') {
      job.status = 'deleted';
      job.deletedAt = now;
      job.updatedAt = now;
      store.set(id, job);
      changed = true;
    }
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function softDeleteAdJob(id: string): boolean {
  return softDeleteAdJobs([id]);
}

export function softDeleteAllAdJobs(): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  const now = new Date().toISOString();
  for (const [id, job] of Array.from(store.entries())) {
    if (job.status !== 'deleted') {
      job.status = 'deleted';
      job.deletedAt = now;
      job.updatedAt = now;
      store.set(id, job);
      changed = true;
    }
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function restoreAdJobs(ids: string[]): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  const now = new Date().toISOString();
  for (const id of ids) {
    const job = store.get(id);
    if (job && job.status === 'deleted') {
      job.status = 'needs_review';
      delete job.deletedAt;
      job.updatedAt = now;
      store.set(id, job);
      changed = true;
    }
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function restoreAllAdJobs(): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  const now = new Date().toISOString();
  for (const [id, job] of Array.from(store.entries())) {
    if (job.status === 'deleted') {
      job.status = 'needs_review';
      delete job.deletedAt;
      job.updatedAt = now;
      store.set(id, job);
      changed = true;
    }
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function permanentlyDeleteAdJobs(ids: string[]): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  for (const id of ids) {
    if (store.delete(id)) changed = true;
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function clearAllDeletedAdJobs(): boolean {
  const store = loadJobsFromFile();
  let changed = false;
  for (const [id, job] of Array.from(store.entries())) {
    if (job.status === 'deleted') {
      store.delete(id);
      changed = true;
    }
  }
  if (changed) saveJobsToFile(store);
  return changed;
}

export function deleteAdJobs(ids: string[]): boolean {
  return softDeleteAdJobs(ids);
}

export function deleteAdJob(id: string): boolean {
  return softDeleteAdJobs([id]);
}
