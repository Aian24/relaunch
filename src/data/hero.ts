export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export const heroData = {
  kicker: "Phoenix, AZ · Est. 2004 · Trusted by 1,500+ Businesses",
  headline: "Marketing, AI & Digital Services.",
  subheadline:
    "Everything your business needs. One subscription. From marketing to AI to web — pick the services that fit, bundle them together, and drive real sales.",
  primaryCta: {
    label: "Build My Bundle",
    href: "#bundle-builder",
  },
  secondaryCta: {
    label: "See Our Work",
    href: "#work",
  },
  stats: [
    {
      value: 20,
      suffix: "+",
      label: "Years in Business",
      sublabel: "Operating in Phoenix since 2004",
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
