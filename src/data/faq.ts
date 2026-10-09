export interface FaqItem {
  question: string;
  answer: string;
  category: "Pricing & Billing" | "Services & Delivery" | "ReLaunch Method";
}

export const faqData: FaqItem[] = [
  {
    question: "How does the ReLaunch bundle subscription work?",
    answer:
      "Pick the exact services you need into one monthly subscription. Bundling 2–3 services saves 10%, 4–5 saves 15%, and 6+ saves 20% across your entire stack.",
    category: "Pricing & Billing",
  },
  {
    question: "Are there long-term contracts or cancellation penalties?",
    answer:
      "Zero long-term contracts. Everything runs on a flexible month-to-month subscription. Add, pause, or cancel anytime directly in your portal.",
    category: "Pricing & Billing",
  },
  {
    question: "What is the 'ReLaunch Method' and the 4-layer selling framework?",
    answer:
      "Our strategic framework combines StoryBrand SB7, narrative positioning, and conversion architecture. Every deliverable is engineered to generate calls and qualified leads.",
    category: "ReLaunch Method",
  },
  {
    question: "What is the difference between Track A and Track B for ReLaunch Social?",
    answer:
      "Track A (from $297/mo): You provide photos or videos; we write captions, design graphics, and schedule. Track B (from $597/mo): 100% done-for-you content created from scratch.",
    category: "Services & Delivery",
  },
  {
    question: "How quickly does a new website or marketing engine launch?",
    answer:
      "Social portals and AI workflows launch in 24–48 hours. Custom Next.js websites typically deploy in 2–3 weeks.",
    category: "Services & Delivery",
  },
  {
    question: "Can you build custom platforms, portals, or databases?",
    answer:
      "Yes. We engineer custom web applications, client portals, CRM pipelines, and database integrations with sub-second performance.",
    category: "Services & Delivery",
  },
  {
    question: "How do I get started?",
    answer:
      "Build your custom bundle online in 60 seconds, or book a free 15-minute strategy session with our team.",
    category: "Pricing & Billing",
  },
];
