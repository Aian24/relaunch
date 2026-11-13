// ReLaunch Studio: Dynamic Timeline & Master Production Assets
// Centralized data repository for Licensed Music Tracks, Branded CTA Templates, Caption Styles, and Trust Badges

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  vibe: string;
  src: string;
  provider?: "Epidemic Sound" | "Artlist" | "Custom Upload" | "Studio Master";
  licenseNote?: string;
  isCustom?: boolean;
  status?: "active" | "deleted";
  deletedAt?: string;
}

export interface CtaTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  headline?: string;
  buttonText?: string;
  styleVariant?: "promo-stamp" | "social-proof" | "native-tag" | "luxury-card" | "urgency-banner";
  accentColor?: string;
  isCustom?: boolean;
  status?: "active" | "deleted";
  deletedAt?: string;
}

export interface CaptionStyle {
  id: string;
  name: string;
  badge: string;
  desc: string;
}

export interface TrustBadgeOption {
  id: string;
  label: string;
  subtext?: string;
  substantiationRequired?: boolean;
}

export const BRAND_COLOR_PRESETS = [
  { name: "ReLaunch Orange", hex: "#FF6700" },
  { name: "Electric Purple", hex: "#7F48ED" },
  { name: "Emerald Growth", hex: "#10B981" },
  { name: "Cyber Blue", hex: "#0EA5E9" },
  { name: "Rose Gold", hex: "#E11D48" },
  { name: "Obsidian", hex: "#09090B" },
];

export const TRUST_BADGE_PRESETS: TrustBadgeOption[] = [
  { id: "30-day-guarantee", label: "30-Day Money-Back Guarantee", subtext: "Verified Client Policy", substantiationRequired: false },
  { id: "free-shipping", label: "Free Express Delivery on All Orders", subtext: "Fulfillment Policy", substantiationRequired: false },
  { id: "licensed-partner", label: "Official Licensed Brand Partner", subtext: "Substantiated Partnership", substantiationRequired: false },
  { id: "dermatologist-tested", label: "Cruelty-Free & Lab Tested", subtext: "Certified Product Quality", substantiationRequired: false },
  { id: "free-consultation", label: "100% Free Consultation (No Card Required)", subtext: "Zero Friction Offer", substantiationRequired: false },
  { id: "client-substantiated", label: "Custom Substantiated Policy Claim", subtext: "Requires Verified Client Proof", substantiationRequired: true },
];

export const LICENSED_MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: "energy-direct-response",
    title: "Velocity Driver",
    genre: "High-Energy Direct Response",
    bpm: 128,
    vibe: "Food & Clicks / Fast Pacing",
    src: "/audio/music/energy-direct-response.mp3",
    provider: "Artlist",
    licenseNote: "Commercial Sync License · Unlimited Web & Social Spend",
  },
  {
    id: "tech-driving-beat",
    title: "Neural Frontier",
    genre: "Tech Driving Beat",
    bpm: 124,
    vibe: "B2B / AI & Modern",
    src: "/audio/music/tech-driving-beat.mp3",
    provider: "Epidemic Sound",
    licenseNote: "Worldwide Digital Ad Clearance · Cleared for Paid Meta & TikTok",
  },
  {
    id: "trendy-upbeat-ugc",
    title: "Rhythm Pop Pulse",
    genre: "Trendy Upbeat UGC",
    bpm: 120,
    vibe: "High Engagement / TikTok",
    src: "/audio/music/trendy-upbeat-ugc.mp3",
    provider: "Epidemic Sound",
    licenseNote: "UGC Trend Sync · Monitored No-Mute Clearance",
  },
  {
    id: "chill-lofi-aesthetic",
    title: "Velvet Glow Serum",
    genre: "Chill Lo-Fi Aesthetic",
    bpm: 85,
    vibe: "Skincare / Luxury / Calm",
    src: "/audio/music/chill-lofi-aesthetic.mp3",
    provider: "Artlist",
    licenseNote: "DTC Lifestyle Clearance · High Retention Soft Dynamic",
  },
  {
    id: "luxury-cinematic",
    title: "Oceanfront Haven",
    genre: "Luxury Cinematic",
    bpm: 75,
    vibe: "Hospitality & Travel",
    src: "/audio/music/luxury-cinematic.mp3",
    provider: "Epidemic Sound",
    licenseNote: "Cinematic 4K Commercial Grade · Full Stem Rights",
  },
];

export const BRANDED_CTA_TEMPLATES: CtaTemplate[] = [
  {
    id: "promo-stamp",
    name: "Promo Stamp",
    badge: "Direct Offer",
    description: "High-contrast offer pill with animated discount tag",
    styleVariant: "promo-stamp",
  },
  {
    id: "social-proof",
    name: "Substantiated Policy Pill",
    badge: "Verified Policy",
    description: "Client-substantiated policy guarantee or verified lab trial badge",
    styleVariant: "social-proof",
  },
  {
    id: "native-tag",
    name: "Native Product Tag",
    badge: "TikTok Native",
    description: "Reels & TikTok native eCommerce product overlay",
    styleVariant: "native-tag",
  },
  {
    id: "luxury-card",
    name: "Luxury Minimalist",
    badge: "Studio Craft",
    description: "Subtle neon border, clean typography, premium finish",
    styleVariant: "luxury-card",
  },
  {
    id: "urgency-banner",
    name: "Urgency Drop Banner",
    badge: "High Conversion",
    description: "Bold attention-grabbing urgency bar with countdown frame",
    styleVariant: "urgency-banner",
  },
];

export const CAPTION_STYLES: CaptionStyle[] = [
  { id: "bold-kinetic", name: "Bold Kinetic", badge: "High CTR", desc: "Yellow active word on dark backdrop" },
  { id: "clean-minimal", name: "Clean Minimal", badge: "Studio", desc: "Crisp white modern typography" },
  { id: "neon-pop", name: "Neon Pop", badge: "Vibrant", desc: "Purple & Orange glow" },
];

export function getMusicTrackById(id: string, customTracks: MusicTrack[] = []): MusicTrack | undefined {
  return [...customTracks, ...LICENSED_MUSIC_LIBRARY].find((t) => t.id === id);
}

export function getCtaTemplateById(id: string, customCtas: CtaTemplate[] = []): CtaTemplate | undefined {
  return [...customCtas, ...BRANDED_CTA_TEMPLATES].find((c) => c.id === id);
}
