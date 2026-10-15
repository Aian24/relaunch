export interface GraderPillar {
  id: string;
  name: string;
  weight: string;
  question: string;
  options: { label: string; score: number; feedback: string }[];
}

export const nisGraderPillars: GraderPillar[] = [
  {
    id: "clarity",
    name: "Customer-Centric Clarity",
    weight: "35%",
    question: "Within 5 seconds on your homepage, is it instantly obvious what problem you solve and what the user must do next?",
    options: [
      { label: "Yes — Clear headline, defined customer problem, and one bold direct CTA above the fold", score: 35, feedback: "Excellent clarity! Your hero section passes the 5-second grunt test." },
      { label: "Somewhat — We describe our company/history, but the direct call to action isn't clear", score: 20, feedback: "You're talking about yourself rather than the customer's problem. Visitors bounce before reaching your offer." },
      { label: "No — Our homepage has multiple confusing links and no single obvious next step", score: 5, feedback: "Severe funnel leak: confusing navigation is causing >70% of potential buyers to leave." },
    ],
  },
  {
    id: "heros_journey",
    name: "Transformation Proof & Video",
    weight: "30%",
    question: "Do your social media and ad campaigns show real client transformations, video proof, and case studies?",
    options: [
      { label: "Yes — We have active video ads, before/after proof, and recent client reviews", score: 30, feedback: "Strong proof architecture! Social proof significantly cuts acquisition costs." },
      { label: "Partial — We post occasionally on social media, but rarely publish video case studies", score: 15, feedback: "Opportunity gap: Static stock posts generate low trust compared to programmatic video." },
      { label: "No — Our social channels are dormant and we lack documented case studies", score: 5, feedback: "Trust deficit: Prospects research your social footprint before calling and find an empty storefront." },
    ],
  },
  {
    id: "persuasive_emotion",
    name: "Emotional Hook & Differentiation",
    weight: "25%",
    question: "Does your marketing sell one compelling big idea, or is it just a boring checklist of services like all your local competitors?",
    options: [
      { label: "Big Idea — We have a unique emotional pitch and clear competitive differentiation", score: 25, feedback: "Distinct positioning allows you to charge premium prices without commodity price wars." },
      { label: "Generic — We list standard bullet points like 'Quality Service' & 'Family Owned'", score: 10, feedback: "Commodity trap: Generic claims force customers to compare you solely on cheap price." },
      { label: "Unsure — We copy whatever competitors in our area are saying", score: 0, feedback: "Zero differentiation: You are blending in with 10 other identical local options." },
    ],
  },
  {
    id: "archetype",
    name: "Brand & Multi-Channel Consistency",
    weight: "10%",
    question: "Is your visual identity, logo, typography, and tone consistent across Google, Meta, website, and offline collateral?",
    options: [
      { label: "100% Consistent — Unified archetype, colors, typography, and professional brand deck", score: 10, feedback: "Polished multi-channel presence maximizes brand recall and perceived enterprise value." },
      { label: "Inconsistent — Old logo on trucks/print, different colors on website and Facebook", score: 5, feedback: "Fragmented identity confuses prospects and diminishes customer trust." },
      { label: "No Standard — Everything is designed ad-hoc by different vendors", score: 0, feedback: "Urgent fix required: Inconsistent branding signals amateur operations." },
    ],
  },
];
