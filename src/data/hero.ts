export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export const heroData = {
  kicker: "Helping small businesses since 2008 · U.S., Canada, UK & Australia",
  headline: "Marketing Strategically Designed to Sell.",
  subheadline:
    "We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.",
  primaryCta: {
    label: "Book a Strategy Call",
    href: "/pricing",
  },
  secondaryCta: {
    label: "See Our Work",
    href: "/work",
  },
  stats: [
    {
      value: 18,
      suffix: " years",
      label: "Years in Business",
      sublabel: "Helping businesses grow since 2008",
    },
    {
      value: 1500,
      suffix: "+",
      label: "Projects Delivered",
      sublabel: "Websites, software & campaigns",
    },
    {
      value: 480,
      suffix: "+",
      label: "Campaigns Launched",
      sublabel: "PPC, social ads & lead pipelines",
    },
    {
      value: 100,
      suffix: "%",
      label: "Client Ownership",
      sublabel: "100% asset and code ownership",
    },
  ] as HeroStat[],
  industries: [
    { name: "Home Services & Contractors", icon: "HardHat" },
    { name: "Restaurants & Hospitality", icon: "Utensils" },
    { name: "Healthcare & Practices", icon: "Stethoscope" },
    { name: "Legal & Professional", icon: "Scale" },
    { name: "Real Estate & Development", icon: "Building2" },
    { name: "E-Commerce & Retail", icon: "ShoppingBag" },
    { name: "Fitness & Wellness", icon: "Activity" },
    { name: "Tech & Software", icon: "Cpu" },
  ],
  pillars: [
    {
      title: "Full-Service Scope",
      description: "Web, social, ads, SEO, branding, and strategy all under one roof.",
      tag: "All-in-One",
    },
    {
      title: "AI & Automation Delivery",
      description: "Keeps delivery lightning-fast and pricing dramatically competitive.",
      tag: "High Velocity",
    },
    {
      title: "Custom Tech Engine",
      description: "We build custom platforms and portals that ordinary agencies cannot.",
      tag: "Enterprise Grade",
    },
  ],
};
