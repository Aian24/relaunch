export interface AiServicePillar {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  tag?: string;
}

export const aiSectionData = {
  badge: "AI for Every Business",
  headline: "The future isn't coming. It's here.",
  subheadline:
    "Every business can leverage AI to automate, grow, and compete at a higher level. We make it happen — no technical experience required.",
  ctaText: "Explore AI Services",
  ctaHref: "#bundle-builder",
};

export const aiPillarsData: AiServicePillar[] = [
  {
    id: "strategy-consulting",
    icon: "Brain",
    title: "AI Strategy & Consulting",
    description: "Find where AI creates the highest ROI, then build a clear actionable roadmap.",
    features: [
      "AI readiness assessment",
      "Opportunity mapping",
      "Vendor & tool selection",
    ],
    tag: "Strategic",
  },
  {
    id: "automation-workflows",
    icon: "Zap",
    title: "Automation & Workflows",
    description: "Eliminate repetitive tasks. Build systems that run while you focus on growth.",
    features: [
      "Lead follow-up sequences",
      "CRM pipeline automation",
      "Zapier & Make builds",
    ],
    tag: "High Velocity",
  },
  {
    id: "content-creative",
    icon: "FileText",
    title: "AI Content & Creative",
    description: "Train AI on your brand voice and generate on-brand content at high scale.",
    features: [
      "Brand voice training",
      "AI copywriting & hooks",
      "Content calendar generation",
    ],
    tag: "Creative",
  },
  {
    id: "customer-experience",
    icon: "Bot",
    title: "AI Customer Experience",
    description: "Chatbots that qualify leads and guide customers 24/7 — no extra staff needed.",
    features: [
      "Website 24/7 chatbots",
      "Lead qualification bots",
      "AI consultation quizzes",
    ],
    tag: "24/7 Intake",
  },
  {
    id: "marketing-ads",
    icon: "Rocket",
    title: "AI Marketing & Ads",
    description: "Let AI optimize targeting, personalize emails, and A/B test automatically.",
    features: [
      "Predictive ad targeting",
      "Email personalization engines",
      "Automated A/B split testing",
    ],
    tag: "Performance",
  },
  {
    id: "business-intelligence",
    icon: "BarChart3",
    title: "AI Business Intelligence",
    description: "Custom dashboards that surface insights so you always know what's working.",
    features: [
      "Automated executive reporting",
      "Competitor monitoring",
      "Revenue & ROI dashboards",
    ],
    tag: "Analytics",
  },
  {
    id: "custom-apps-tools",
    icon: "Terminal",
    title: "AI-Powered Apps & Tools",
    description: "Custom web and mobile apps with AI baked in — built for your workflow.",
    features: [
      "Custom AI apps & portals",
      "Client onboarding portals",
      "Internal team business tools",
    ],
    tag: "Custom Dev",
  },
  {
    id: "enterprise-solutions",
    icon: "ShieldCheck",
    title: "Industry AI Solutions",
    description: "AI tailored for your specific industry — e-commerce, wellness, hospitality, legal, and trades.",
    features: [
      "E-commerce smart recommendations",
      "Healthcare & wellness quizzes",
      "Hospitality & real estate funnels",
    ],
    tag: "Specialized",
  },
];
