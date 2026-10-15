export interface OutcomeGroup {
  id: "get-found" | "get-chosen" | "get-more-customers" | "build-custom";
  num: string;
  title: string;
  promise: string;
  problem: string;
  whatWeDo: string;
  deliverables: string[];
  startingPrice: string;
  startingPricePrefix?: string;
  priceNote?: string;
  productName: string;
  productHref: string;
  productCtaLabel: string;
  homepageCardBody: string;
  homepageYouGet: string;
}

export interface ReLaunchProduct {
  id: "social-audit" | "ai-recommendations" | "social" | "studio";
  name: string;
  tagline: string;
  oneLiner: string;
  serviceGroup: string;
  serviceGroupId: string;
  href: string;
  externalUrl?: string;
  badge?: string;
  roleOnSite: string;
}

export const outcomeGroups: OutcomeGroup[] = [
  {
    id: "get-found",
    num: "01",
    title: "Get Found",
    promise: "Show up when customers search on Google, Maps, or ask ChatGPT.",
    problem: "Customers can't buy from you if they can't find you.",
    whatWeDo:
      "We set up and manage your Google Business Profile, improve your local search rankings, bring in steady new reviews, and get your business named when people ask AI tools for a recommendation.",
    deliverables: [
      "Optimized Google Business Profile and directory listings",
      "Automatic review requests after every job",
      "Local SEO for the searches your customers actually use",
      "A monthly report: where you rank and where AI mentions you",
    ],
    startingPrice: "$497/mo",
    startingPricePrefix: "From ",
    priceNote: "Local SEO, reviews and AI recommendations",
    productName: "ReLaunch AI Recommendations",
    productHref: "/ai-recommendations",
    productCtaLabel: "Start with ReLaunch AI Recommendations, from $497/mo →",
    homepageCardBody:
      "Customers can't buy from you if they can't find you. We put you on Google, Maps, and in ChatGPT's answers.",
    homepageYouGet:
      "optimized listings, review requests, a monthly visibility report.",
  },
  {
    id: "get-chosen",
    num: "02",
    title: "Get Chosen",
    promise: "Look like the best choice the moment they find you.",
    problem: "Buyers check you out before they call.",
    whatWeDo:
      "We make your website, brand and social media look like the obvious choice.",
    deliverables: [
      "A site built to convert and brand kit",
      "Hosting, updates and security handled for you",
      "12–20+ posts a month, one approval per month",
      "Fresh social posts every week",
    ],
    startingPrice: "$297/mo",
    startingPricePrefix: "From ",
    priceNote: "Website care, brand and weekly social posts",
    productName: "ReLaunch Social",
    productHref: "/social",
    productCtaLabel: "Start with ReLaunch Social, from $297/mo →",
    homepageCardBody:
      "Buyers check you out before they call. We make your website, brand and social media look like the obvious choice.",
    homepageYouGet:
      "a site built to convert and posts every week you approve once a month.",
  },
  {
    id: "get-more-customers",
    num: "03",
    title: "Get More Customers",
    promise: "Turn clicks and calls into paying customers.",
    problem: "Clicks aren't customers.",
    whatWeDo:
      "We run your ads and make sure every lead gets an answer fast.",
    deliverables: [
      "Managed Google & Meta ads",
      "ReLaunch Studio AI video ads every week",
      "Instant follow-up (chat, missed-call text-back, booking)",
      "Cost-per-customer in your report",
    ],
    startingPrice: "$797/mo",
    startingPricePrefix: "From ",
    priceNote: "Managed ads, weekly video ads and lead follow-up",
    productName: "ReLaunch Studio",
    productHref: "/studio",
    productCtaLabel: "Start with ReLaunch Studio, from $797/mo →",
    homepageCardBody:
      "Clicks aren't customers. We run your ads and make sure every lead gets an answer fast.",
    homepageYouGet:
      "managed Google & Meta ads, instant follow-up, fresh AI video ads every week, cost-per-customer reporting.",
  },
  {
    id: "build-custom",
    num: "04",
    title: "Build Something Custom",
    promise: "Software that fits how your business runs.",
    problem: "When off-the-shelf doesn't fit.",
    whatWeDo:
      "We build the app, portal or integration your business runs on.",
    deliverables: [
      "Web apps, portals, mobile apps, integrations, automations",
      "Fixed-scope plan, milestone dates, you own the code",
      "Modernization of legacy systems with zero downtime",
      "Managed hosting, monitoring, backups and maintenance",
    ],
    startingPrice: "Custom quote",
    startingPricePrefix: "",
    priceNote: "Fixed scope, milestone dates, you own the code",
    productName: "Custom Software",
    productHref: "/custom-software",
    productCtaLabel: "Custom quote →",
    homepageCardBody:
      "When off-the-shelf doesn't fit. We build the app, portal or integration your business runs on.",
    homepageYouGet:
      "a fixed-scope plan, milestone dates, and you own the code.",
  },
];

export const productsData: ReLaunchProduct[] = [
  {
    id: "ai-recommendations",
    name: "ReLaunch AI Recommendations",
    tagline: "Get Recommended by AI",
    oneLiner:
      "Gets your business named when people ask ChatGPT, Gemini or Claude for a recommendation.",
    serviceGroup: "Get Found",
    serviceGroupId: "get-found",
    href: "/ai-recommendations",
    badge: "New",
    roleOnSite: "Featured product; own landing page",
  },
  {
    id: "social",
    name: "ReLaunch Social",
    tagline: "Your social media, handled. Every week.",
    oneLiner:
      "We post to your accounts every week; you approve once a month.",
    serviceGroup: "Get Chosen",
    serviceGroupId: "get-chosen",
    href: "/social",
    roleOnSite: "Product page & portal checkout (from $297/mo & from $597/mo)",
  },
  {
    id: "studio",
    name: "ReLaunch Studio",
    tagline: "Fresh video ads. Every week.",
    oneLiner:
      "New AI video ads for Meta and TikTok every week, improved from what performed.",
    serviceGroup: "Get More Customers",
    serviceGroupId: "get-more-customers",
    href: "/studio",
    badge: "Studio",
    roleOnSite: "Weekly video ad creative subscription",
  },
  {
    id: "social-audit",
    name: "ReLaunch Social Audit",
    tagline: "How well does your marketing sell?",
    oneLiner:
      "Scores how well your marketing sells, using our proprietary method, and shows what to fix first.",
    serviceGroup: "Front door to all four",
    serviceGroupId: "get-found",
    href: "/audit",
    roleOnSite: "Free score lead magnet leading to the strategy call",
  },
];

export const bundleDiscounts = {
  headline: "Combine services and save.",
  body: "2–3 services: 10% off · 4–5 services: 15% off · 6 or more: 20% off. The discount applies to your whole monthly bill.",
  calculatorLink: "/pricing#bundle-calculator",
  calculatorText: "Build your own bundle →",
  tiers: [
    { count: "2–3 services", percent: "10% off" },
    { count: "4–5 services", percent: "15% off" },
    { count: "6 or more", percent: "20% off" },
  ],
};

export const companyCreds = {
  tagline: "Marketing Strategically Designed to Sell.",
  approvedSubhead:
    "We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.",
  heroEyebrow:
    "Helping small businesses grow since 2008 · U.S., Canada, UK & Australia",
  established: 2008,
  yearsInBusiness: 18,
  projectsDelivered: "1,500+",
  campaignsLaunched: "480+",
  activeCountries: "4 countries (U.S., Canada, UK & Australia)",
  homeBaseLocation: "Phoenix, AZ",
  homeBaseDisclaimer:
    "Based in Phoenix, AZ · Working with clients everywhere",
  phone: "(480) 779-9875",
  phoneTel: "tel:4807799875",
  email: "care@relaunch.us",
  emailMailto: "mailto:care@relaunch.us",
  founder: {
    name: "Robert “Bobby” Clark",
    shortName: "Bobby Clark",
    title: "Founder",
    experienceYears: 18,
    photo: "/images/bobby-clark.jpg",
    headline: "You'll talk to me, not an account manager.",
    bio: "I'm Bobby Clark. I've spent 18 years helping small businesses across the U.S., Canada, the UK and Australia get found, get chosen and get paid. When you work with ReLaunch, you work directly with me and our senior team.",
    promises: [
      {
        title: "Senior team only",
        description: "No hand-offs to junior staff.",
      },
      {
        title: "You own it all",
        description: "Code, designs, accounts and ads are yours.",
      },
      {
        title: "Month-to-month",
        description: "We keep you with results, not contracts.",
      },
    ],
  },
  socialAuditPricing: {
    freeScore: {
      name: "Free score",
      price: "Free",
      deliverable: "Your overall score and your weakest area",
      channels: "Website",
      nextStep: "Upgrade or book a call",
    },
    fullAudit: {
      name: "Full audit",
      price: "$495, one time",
      deliverable:
        "A written report: score by area, every gap we found, and a prioritized fix list",
      channels: "Website, social media, Google profile and reviews",
      nextStep: "Walk-through call with Bobby",
    },
  },
};
