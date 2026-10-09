export interface BundleTier {
  id: string;
  name: string;
  countLabel: string;
  minServices: number;
  maxServices: number;
  discountPercent: number;
  discountBadge: string;
  description: string;
  highlighted?: boolean;
}

export interface SelectableService {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  popular?: boolean;
}

export const bundleTiers: BundleTier[] = [
  {
    id: "starter",
    name: "Starter",
    countLabel: "1 Service",
    minServices: 1,
    maxServices: 1,
    discountPercent: 0,
    discountBadge: "Standard Rate",
    description: "One dedicated high-impact recurring service.",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    countLabel: "2–3 Services",
    minServices: 2,
    maxServices: 3,
    discountPercent: 10,
    discountBadge: "Save 10%",
    description: "Two to three complementary services working in synergy.",
    highlighted: false,
  },
  {
    id: "scale",
    name: "Scale",
    countLabel: "4–5 Services",
    minServices: 4,
    maxServices: 5,
    discountPercent: 15,
    discountBadge: "Save 15%",
    description: "Four to five integrated services with compounding savings.",
    highlighted: false,
  },
  {
    id: "mission-control",
    name: "Mission Control",
    countLabel: "6+ Services",
    minServices: 6,
    maxServices: 99,
    discountPercent: 20,
    discountBadge: "Save 20%",
    description: "Full turnkey growth department with maximum 20% savings.",
    highlighted: true,
  },
];

export const selectableServices: SelectableService[] = [
  {
    id: "marketing-ads",
    name: "Paid Ads & Local SEO",
    category: "Traffic & Leads",
    basePrice: 790,
    description: "Google Ads, Meta campaigns, and Google Business ranking.",
    popular: true,
  },
  {
    id: "relaunch-social",
    name: "Social Media Autopilot",
    category: "Social Presence",
    basePrice: 497,
    description: "Done-for-you content creation and publishing across 5 platforms.",
    popular: true,
  },
  {
    id: "web-dev",
    name: "Web Platform & Care",
    category: "Digital Assets",
    basePrice: 890,
    description: "Custom Next.js hosting, landing pages, and ongoing maintenance.",
    popular: true,
  },
  {
    id: "ai-automation",
    name: "AI Automations & CRM",
    category: "Automation",
    basePrice: 690,
    description: "24/7 lead qualification bots and automated follow-up flows.",
    popular: true,
  },
  {
    id: "video-creative",
    name: "Video & Content",
    category: "Creative",
    basePrice: 590,
    description: "Short-form reels, explainer videos, and creative assets.",
  },
  {
    id: "email-marketing",
    name: "Email & SMS Marketing",
    category: "Retention",
    basePrice: 450,
    description: "Automated welcome flows, promotions, and list reactivation.",
  },
  {
    id: "brand-design",
    name: "Brand & Design Kit",
    category: "Creative",
    basePrice: 490,
    description: "Brand identity, sales collateral, and visual systems.",
  },
  {
    id: "custom-software",
    name: "Custom Apps & Portals",
    category: "Software",
    basePrice: 1200,
    description: "Dedicated web apps, portals, and custom integrations.",
  },
  {
    id: "nis-advisory",
    name: "Strategic Advisory",
    category: "Strategy",
    basePrice: 350,
    description: "Monthly diagnostic audit and executive growth strategy.",
  },
];
