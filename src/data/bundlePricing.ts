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
    id: "turnkey",
    name: "Turnkey Department",
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
    id: "local-seo",
    name: "Local SEO & Reviews",
    category: "Get Found",
    basePrice: 497,
    description: "Google Business Profile, local rankings and automatic review requests.",
    popular: true,
  },
  {
    id: "relaunch-social",
    name: "ReLaunch Social",
    category: "Get Chosen",
    basePrice: 297,
    description: "Weekly social posts from your photos, published for you. More plans on the Social page.",
    popular: true,
  },
  {
    id: "web-dev",
    name: "Website Care & Hosting",
    category: "Get Chosen",
    basePrice: 890,
    description: "Hosting, updates, security and ongoing improvements to your website.",
    popular: true,
  },
  {
    id: "brand-design",
    name: "Brand & Design Kit",
    category: "Get Chosen",
    basePrice: 490,
    description: "Logo, colors, brand guidelines and sales materials.",
  },
  {
    id: "marketing-ads",
    name: "Google & Meta Ads",
    category: "Get More Customers",
    basePrice: 797,
    description: "Managed ad campaigns with a monthly cost-per-customer report. Ad spend billed separately.",
    popular: true,
  },
  {
    id: "ai-automation",
    name: "Instant Lead Follow-up",
    category: "Get More Customers",
    basePrice: 690,
    description: "Every new lead gets a fast reply by text, chat or email.",
  },
  {
    id: "email-marketing",
    name: "Email & SMS Marketing",
    category: "Get More Customers",
    basePrice: 450,
    description: "Campaigns and automatic flows that bring past customers back.",
  },
  {
    id: "custom-software",
    name: "Custom Apps & Portals",
    category: "Build Something Custom",
    basePrice: 1200,
    description: "Ongoing development and support for your custom software.",
  },
  {
    id: "nis-advisory",
    name: "Monthly Strategy Session",
    category: "Strategy",
    basePrice: 350,
    description: "A monthly review of your numbers and a plan for what to fix next.",
  },
];
