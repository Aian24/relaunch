export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  niche: string;
  actorPresetId: string;
  platforms: ("Meta" | "TikTok" | "YouTube")[];
  sparkAdCodeReady: boolean;
  metaPartnershipEnabled: boolean;
  consentAgreementOnFile: boolean;
  agreementId: string;
  verifiedDate: string;
  followersCount: string;
  avgEngagement: string;
  hasVideoTakes?: boolean;
}

export const CREATOR_ROSTER: CreatorProfile[] = [
  {
    id: "cr-haley",
    name: "Haley",
    handle: "@haleycreative",
    niche: "Lifestyle, DTC & Everyday Routine",
    actorPresetId: "haley",
    hasVideoTakes: true,
    platforms: ["Meta", "TikTok", "YouTube"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-HALEY-001",
    verifiedDate: "2026-10-30",
    followersCount: "168K",
    avgEngagement: "5.4%",
  },
  {
    id: "cr-emily",
    name: "Emily",
    handle: "@emilycreative",
    niche: "Lifestyle, Wellness, Skincare & DTC",
    actorPresetId: "emily",
    hasVideoTakes: true,
    platforms: ["Meta", "TikTok", "YouTube"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-EMILY-002",
    verifiedDate: "2026-11-04",
    followersCount: "194K",
    avgEngagement: "5.8%",
  },
  {
    id: "cr-01",
    name: "Emma Davis",
    handle: "@trendspotlight",
    niche: "Foodie & Lifestyle Dining",
    actorPresetId: "emma",
    hasVideoTakes: false,
    platforms: ["Meta", "TikTok"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-EMMA-081",
    verifiedDate: "2026-10-15",
    followersCount: "142K",
    avgEngagement: "4.8%",
  },
  {
    id: "cr-02",
    name: "Marcus Vance",
    handle: "@everydayreviews",
    niche: "Fitness & Casual Lifestyle",
    actorPresetId: "marcus",
    hasVideoTakes: false,
    platforms: ["Meta", "TikTok", "YouTube"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-MARC-114",
    verifiedDate: "2026-10-18",
    followersCount: "218K",
    avgEngagement: "5.2%",
  },
  {
    id: "cr-03",
    name: "Sarah Jenkins",
    handle: "@glowwithsarah",
    niche: "Clean Beauty & Wellness DTC",
    actorPresetId: "sarah",
    hasVideoTakes: false,
    platforms: ["Meta", "TikTok"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-SARAH-309",
    verifiedDate: "2026-10-20",
    followersCount: "95K",
    avgEngagement: "6.1%",
  },
  {
    id: "cr-04",
    name: "David Chen",
    handle: "@techdailyinsights",
    niche: "Tech, Software & Productivity",
    actorPresetId: "david",
    hasVideoTakes: false,
    platforms: ["Meta", "TikTok", "YouTube"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-DAVE-412",
    verifiedDate: "2026-10-22",
    followersCount: "175K",
    avgEngagement: "5.8%",
  },
  {
    id: "cr-05",
    name: "Chloe Bennett",
    handle: "@chloestyleguide",
    niche: "Fashion, Apparel & Retail",
    actorPresetId: "chloe",
    platforms: ["Meta", "TikTok"],
    sparkAdCodeReady: true,
    metaPartnershipEnabled: true,
    consentAgreementOnFile: true,
    agreementId: "AGR-2026-CHLOE-520",
    verifiedDate: "2026-10-24",
    followersCount: "310K",
    avgEngagement: "4.5%",
  },
];
