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
}

export const CREATOR_ROSTER: CreatorProfile[] = [
  {
    id: "cr-01",
    name: "Emma Davis",
    handle: "@trendspotlight",
    niche: "Foodie & Lifestyle Dining",
    actorPresetId: "emma",
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
