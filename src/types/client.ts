import { z } from "zod";

export const CLIENT_STATUSES = ["prospect", "active", "paused", "archived"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const RAW_FOOTAGE_STATUSES = ["raw", "processing", "processed", "failed"] as const;
export type RawFootageStatus = (typeof RAW_FOOTAGE_STATUSES)[number];

export const SCENE_ROLES = ["hook_alt", "product", "broll", "detail", "cta"] as const;
export type SceneRole = (typeof SCENE_ROLES)[number];

export const TrustBadgeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  subtext: z.string().optional().default(""),
});

export type ClientTrustBadge = z.infer<typeof TrustBadgeSchema>;

export const BrandProfileSchema = z.object({
  category: z.string().optional().default("General"),
  offerPromo: z.string().optional().default(""),
  targetAudience: z.string().optional().default(""),
  brandVoice: z.string().optional().default(""),
  brandColor: z.string().optional().default("#FF6700"),
  doNotSay: z.array(z.string()).optional().default([]),
  approvedClaims: z.array(z.string()).optional().default([]),
  trustBadges: z.array(TrustBadgeSchema).optional().default([]),
  defaultVisualPrompt: z.string().optional().default(""),
  defaultMusicTrackId: z.string().optional().default("trendy-upbeat-ugc"),
  website: z.string().optional().default(""),
});

export type BrandProfile = z.infer<typeof BrandProfileSchema>;
export type BrandProfileInput = z.input<typeof BrandProfileSchema>;

export const ClientCreateSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(255),
  slug: z.string().trim().max(120).optional(),
  status: z.enum(CLIENT_STATUSES).optional().default("prospect"),
  contactName: z.string().trim().max(255).optional().default(""),
  contactEmail: z.string().trim().max(255).optional().default(""),
  contactPhone: z.string().trim().max(50).optional().default(""),
  website: z.string().trim().max(255).optional().default(""),
  logoUrl: z.string().trim().optional().default(""),
  brandAssetsRef: z.string().trim().optional().default(""),
  isSample: z.boolean().optional().default(false),
  brandProfile: BrandProfileSchema.optional().default(() => BrandProfileSchema.parse({})),
});

export const BrandProfileUpdateSchema = z.object({
  category: z.string().optional(),
  offerPromo: z.string().optional(),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
  brandColor: z.string().optional(),
  doNotSay: z.array(z.string()).optional(),
  approvedClaims: z.array(z.string()).optional(),
  trustBadges: z.array(TrustBadgeSchema).optional(),
  defaultVisualPrompt: z.string().optional(),
  defaultMusicTrackId: z.string().optional(),
  website: z.string().optional(),
});

export const ClientUpdateSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(255).optional(),
  slug: z.string().trim().max(120).optional(),
  status: z.enum(CLIENT_STATUSES).optional(),
  contactName: z.string().trim().max(255).optional(),
  contactEmail: z.string().trim().max(255).optional(),
  contactPhone: z.string().trim().max(50).optional(),
  website: z.string().trim().max(255).optional(),
  logoUrl: z.string().trim().optional(),
  brandAssetsRef: z.string().trim().optional(),
  isSample: z.boolean().optional(),
  brandProfile: BrandProfileUpdateSchema.optional(),
});

export interface ClientRecord {
  id: string;
  name: string;
  slug: string;
  status: ClientStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  brandProfile: BrandProfile;
  logoUrl: string;
  brandAssetsRef: string;
  isSample: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAdsBreakdown {
  draft: number;
  generating: number;
  inReview: number;
  approved: number;
  delivered: number;
  total: number;
}

export interface ClientSummary extends ClientRecord {
  rawFootageCount: number;
  clipCount: number;
  mediaAssetCount: number;
  adsCount: ClientAdsBreakdown;
}

export interface ClientApprovedCreator {
  id: string;
  clientId: string;
  creatorSlug: string;
  isApproved: boolean;
  timesUsed: number;
  lastUsedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface ClientRawFootage {
  id: string;
  clientId: string;
  storageUrl: string;
  playableUrl?: string;
  spriteUrl?: string;
  thumbnailUrl?: string;
  filename: string;
  duration: number;
  mime: string;
  codec?: string;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  status: RawFootageStatus;
  errorMessage?: string;
  uploadedAt: string;
}

export interface ClientClip {
  id: string;
  clientId: string;
  sourceRawId: string;
  inPoint: number;
  outPoint: number;
  sceneRole: SceneRole;
  label: string;
  notes: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  status: "active" | "deleted";
  createdAt: string;
  updatedAt: string;
  // Joined from source raw footage when queried
  sourceFilename?: string;
  sourcePlayableUrl?: string;
  sourceStorageUrl?: string;
  sourceSpriteUrl?: string;
  sourceDuration?: number;
}

export interface ClientMediaAsset {
  id: string;
  clientId: string;
  brandSlug?: string;
  brandName?: string;
  title: string;
  category: "product-demo" | "b-roll" | "unboxing" | "packaging" | "logo";
  targetScene: 2 | 3;
  src: string;
  durationSeconds?: number;
  fileSizeMb?: number;
  status: "active" | "deleted";
  deletedAt?: string;
  uploadedAt: string;
}

export interface ReviewLinkRecord {
  id: string;
  clientId: string;
  adId: string;
  label: string;
  shareToken: string;
  createdBy: string;
  expiresAt?: string;
  revokedAt?: string;
  lastViewedAt?: string;
  createdAt: string;
}

export interface ApprovedDeliverableRecord {
  id: string;
  clientId: string;
  adJobId: string;
  isSample: boolean;
  variants: Record<string, string | undefined>;
  driveFolderId?: string;
  driveFileIds?: Record<string, string | undefined>;
  zipPackageUrl?: string;
  approvedBy: string;
  approvedAt: string;
  deliveredAt?: string;
}

export function slugifyClientName(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "client";
}
