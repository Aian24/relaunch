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
  | 'delivered';

export interface AdJobComplianceChecks {
  creatorVerification: boolean;    // Real UGC / creator hook verified
  scriptClaims: boolean;           // No misleading or unsubstantiated claims
  clientFootagePresent: boolean;   // Authentic client product/location footage confirmed
  disclosureState: boolean;        // AI disclosure badge confirmed burned into media
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
  createdAt: string;
  updatedAt: string;
}

// In-Memory Ad Jobs Store for Dev Server
const AD_JOBS_STORE: Map<string, AdJob> = new Map();

export function getAllAdJobs(): AdJob[] {
  return Array.from(AD_JOBS_STORE.values());
}

export function getAdJobById(id: string): AdJob | null {
  return AD_JOBS_STORE.get(id) || null;
}

export function saveAdJob(job: AdJob): AdJob {
  job.updatedAt = new Date().toISOString();
  AD_JOBS_STORE.set(job.id, job);
  return job;
}

export function clearAllAdJobs(): void {
  AD_JOBS_STORE.clear();
}
