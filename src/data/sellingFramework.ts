export interface HeroPersona {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  targetExamples: string;
  primaryDesire: string;
  externalProblem: string;
  internalProblem: string;
  whatIsAtStake: string;
  successLooksLike: string;
  ctaText: string;
  ctaHref: string;
}

export interface SellingLayer {
  layer: string;
  weight: number;
  weightPercent: string;
  role: string;
  whereItApplies: string;
  color: string;
}

export interface PlanStep {
  stepNumber: string;
  title: string;
  description: string;
  detail: string;
}

export const twoHeroesData: HeroPersona[] = [
  {
    id: "local-business",
    title: "Local Business Owner",
    subtitle: "Home Services, Contractors, Clinics, Local Brands",
    badge: "Primary Growth Path",
    icon: "Store",
    targetExamples: "HVAC, screen repair, dance studios, optometry clinics, contractors",
    primaryDesire: "More inbound calls, booked appointments, and revenue growth",
    externalProblem: "Marketing isn't bringing in paying customers predictably",
    internalProblem: "No time, burned by past agencies who sold vanity metrics, unsure what actually works",
    whatIsAtStake: "Losing prime market share to competitors who market better; wasted ad spend",
    successLooksLike: "The phone rings consistently; marketing turns into a predictable profit center",
    ctaText: "Get Free NIS Marketing Grade",
    ctaHref: "#nis-grader",
  },
  {
    id: "enterprise-tech",
    title: "Organization & Enterprise",
    subtitle: "Mid-Market, Growing Companies & Custom Builds",
    badge: "Advanced Tech Path",
    icon: "Layers",
    targetExamples: "Organizations like NCCI, Golf Central Magazine, high-volume operations",
    primaryDesire: "Custom software, portals, and data automation that works and ships on time",
    externalProblem: "Backlog of features, outdated legacy systems, slow & overpriced large firms",
    internalProblem: "Needs a builder who understands real business ROI, not just lines of code",
    whatIsAtStake: "Missed operational goals, stalled digital transformation, budget lost to bloated tools",
    successLooksLike: "A custom platform delivered on budget, adopted by users, and supported continuously",
    ctaText: "Discuss Your Custom Project",
    ctaHref: "#contact",
  },
];

export const sellingFrameworkLayers: SellingLayer[] = [
  {
    layer: "StoryBrand SB7 Framework",
    weight: 35,
    weightPercent: "35%",
    role: "Positions customer as the hero, defines their urgent problem, establishes ReLaunch as guide with a clear plan and direct call to action.",
    whereItApplies: "Website architecture, landing pages, direct-response ad copy, core headlines",
    color: "#FF6700",
  },
  {
    layer: "Hero's Journey Narrative",
    weight: 30,
    weightPercent: "30%",
    role: "Dramatizes and proves the customer's transformation from frustration to measurable business victory.",
    whereItApplies: "Social video content, case studies, video ads, client success testimonials",
    color: "#090D16",
  },
  {
    layer: "Draper Emotional Principles",
    weight: 25,
    weightPercent: "25%",
    role: "One big emotional idea per campaign; captures attention immediately by selling the feeling and business outcome, not a sterile feature checklist.",
    whereItApplies: "Campaign concepts, creative direction, high-impact hooks and taglines",
    color: "#FF6700",
  },
  {
    layer: "Archetype Consistency",
    weight: 10,
    weightPercent: "10%",
    role: "Enforces one disciplined brand voice, tone, and visual identity across every channel and asset.",
    whereItApplies: "Visual identity, typography, caption styling, client portal experience",
    color: "#090D16",
  },
];

export const threeStepPlan: PlanStep[] = [
  {
    stepNumber: "01",
    title: "Talk to Us or Get Your Free Grade",
    description: "Start with a 15-minute diagnostic call or use our instant NIS Marketing Grader to pinpoint where your current marketing fails to sell.",
    detail: "Zero pressure. We identify the highest-leverage leaks in your funnel within minutes.",
  },
  {
    stepNumber: "02",
    title: "We Build Your Pitch & Delivery Plan",
    description: "We craft a one-page sales brief and architect the exact marketing stack, AI automations, or custom software required.",
    detail: "Every asset is mapped to the 4-layer selling framework before a single line of code or copy is written.",
  },
  {
    stepNumber: "03",
    title: "We Launch It & Keep It Selling",
    description: "Your new engine goes live. We manage, optimize, and scale it monthly under your single flexible subscription.",
    detail: "Clear dashboard reporting in plain business numbers. Pause, upgrade, or cancel anytime.",
  },
];
