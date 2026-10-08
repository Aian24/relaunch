export interface EmailMessage {
  id: string;
  date: string;
  sender: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  isSent?: boolean;
}

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  intent: "strategy-session" | "ai-audit" | "nis-grader" | "bundle-inquiry" | "general";
  date: string;
  status: "new" | "reviewing" | "contacted" | "scheduled" | "closed";
  budget?: string;
  notes: string;
  score?: number;
  priority: "high" | "medium" | "low";
  bookingDate?: string;
  bookingTime?: string;
  bookingStatus?: "upcoming" | "completed" | "rescheduled" | "cancelled";
  meetLink?: string;
  emailSubject?: string;
  isRead?: boolean;
  isStarred?: boolean;
  emailHistory?: EmailMessage[];
}

export interface AdminPageItem {
  id: string;
  path: string;
  title: string;
  headline: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  status: "Under Dev" | "Published · Live" | "Draft" | "Review Required" | "In Progress";
  lastModified: string;
}

export interface AdminMediaAsset {
  id: string;
  name: string;
  type: "video" | "image" | "logo";
  url: string;
  size: string;
  resolution: string;
  usedIn: string;
  uploadedDate: string;
}

export const initialAdminLeads: AdminLead[] = [
  {
    id: "LEAD-1082",
    name: "Marcus Vance",
    email: "marcus@sunvalleypatios.com",
    phone: "(480) 555-0192",
    business: "Sun Valley Outdoor Living",
    service: "Brand Strategy & Performance Media",
    intent: "strategy-session",
    date: "2026-10-08 08:32 AM",
    status: "scheduled",
    budget: "$3,000 – $5,000 / mo",
    notes: "Needs local map-pack dominance and multi-channel lead acquisition for contractor bookings. Booked 30-min strategy call.",
    priority: "high",
    bookingDate: "Oct 12, 2026",
    bookingTime: "10:00 AM MST",
    bookingStatus: "upcoming",
    meetLink: "https://meet.google.com/rel-stgy-phx",
    emailSubject: "Strategy Session Request · Sun Valley Outdoor Living",
    isRead: false,
    isStarred: true,
    emailHistory: [
      {
        id: "EM-1",
        date: "2026-10-08 08:32 AM",
        sender: "Marcus Vance",
        senderEmail: "marcus@sunvalleypatios.com",
        recipientEmail: "care@relaunch.us",
        subject: "Strategy Session Request · Sun Valley Outdoor Living",
        body: "Hi ReLaunch Team,\n\nWe are looking to scale our custom patio installations across the Phoenix metro. We'd love to review your performance media and local SEO strategy.\n\nThanks,\nMarcus",
      },
    ],
  },
  {
    id: "LEAD-1081",
    name: "Dr. Elena Rostova",
    email: "elena@scottsdalewellness.clinic",
    phone: "(602) 555-0843",
    business: "Scottsdale Wellness & Longevity",
    service: "AI Chatbots & Lead Qualification",
    intent: "ai-audit",
    date: "2026-10-07 04:15 PM",
    status: "scheduled",
    budget: "$2,500 / mo",
    notes: "Interested in 24/7 autonomous SMS & Web intake agent to pre-qualify high-ticket patients.",
    priority: "high",
    bookingDate: "Oct 14, 2026",
    bookingTime: "01:00 PM MST",
    bookingStatus: "upcoming",
    meetLink: "https://meet.google.com/rel-ai-audit",
    emailSubject: "AI Readiness & Patient Intake Automation Audit",
    isRead: false,
    isStarred: true,
    emailHistory: [
      {
        id: "EM-2",
        date: "2026-10-07 04:15 PM",
        sender: "Dr. Elena Rostova",
        senderEmail: "elena@scottsdalewellness.clinic",
        recipientEmail: "care@relaunch.us",
        subject: "AI Readiness & Patient Intake Automation Audit",
        body: "Hello,\n\nOur clinic receives 40+ patient inquiries weekly, but our staff misses after-hours calls. We want to evaluate your autonomous AI intake voice and chat agent.\n\nBest,\nDr. Elena",
      },
    ],
  },
  {
    id: "LEAD-1080",
    name: "Trevor Cole",
    email: "t.cole@azscreenrepair.com",
    phone: "(480) 555-9271",
    business: "Apex Screen & Enclosures",
    service: "NIS Marketing Score Audit",
    intent: "nis-grader",
    date: "2026-10-07 01:20 PM",
    status: "contacted",
    budget: "$1,500 – $3,000 / mo",
    notes: "Scored 48/100 on NIS Marketing Grader. High lead leakage identified on mobile landing page.",
    score: 48,
    priority: "medium",
    bookingDate: "Oct 16, 2026",
    bookingTime: "11:30 AM MST",
    bookingStatus: "upcoming",
    meetLink: "https://meet.google.com/rel-nis-apex",
    emailSubject: "NIS Marketing Grader Results (Score: 48/100)",
    isRead: true,
    isStarred: false,
    emailHistory: [
      {
        id: "EM-3",
        date: "2026-10-07 01:20 PM",
        sender: "Trevor Cole",
        senderEmail: "t.cole@azscreenrepair.com",
        recipientEmail: "care@relaunch.us",
        subject: "NIS Marketing Grader Results (Score: 48/100)",
        body: "Completed the grader on your website. Score came out to 48. Let me know what changes we need to stop losing mobile quote requests.",
      },
    ],
  },
  {
    id: "LEAD-1079",
    name: "Sarah Jenkins",
    email: "sarah@carmencollection.com",
    phone: "(480) 555-3810",
    business: "Carmen Boutique Properties",
    service: "Web Architecture & Direct Booking Portal",
    intent: "bundle-inquiry",
    date: "2026-10-06 11:45 AM",
    status: "reviewing",
    budget: "$6,500 / mo (Growth Bundle)",
    notes: "Looking to expand custom reservation UX to 2 new destination locations in Sedona.",
    priority: "high",
    bookingDate: "Oct 19, 2026",
    bookingTime: "02:30 PM MST",
    bookingStatus: "upcoming",
    meetLink: "https://meet.google.com/rel-carmen-portal",
    emailSubject: "Bundle Inquiry: Custom Booking Engine & Brand Rebuild",
    isRead: true,
    isStarred: true,
    emailHistory: [
      {
        id: "EM-4",
        date: "2026-10-06 11:45 AM",
        sender: "Sarah Jenkins",
        senderEmail: "sarah@carmencollection.com",
        recipientEmail: "care@relaunch.us",
        subject: "Bundle Inquiry: Custom Booking Engine & Brand Rebuild",
        body: "Hi Ian,\n\nWe saw the TurfLife direct booking engine showcase on your website. We need a similar custom direct booking flow for our boutique vacation rentals in Sedona without relying on Airbnb's 15% platform fee.\n\nWarmly,\nSarah",
      },
    ],
  },
  {
    id: "LEAD-1078",
    name: "David Kim",
    email: "dkim@verticallogistics.io",
    phone: "(602) 555-7729",
    business: "Vertical Fleet AI",
    service: "AEO / GEO & Custom Software",
    intent: "ai-audit",
    date: "2026-10-05 02:10 PM",
    status: "closed",
    budget: "$8,000 / mo",
    notes: "Onboarding completed. GEO knowledge-graph structuring and client portal API deployment active.",
    priority: "medium",
    bookingDate: "Oct 05, 2026",
    bookingTime: "09:00 AM MST",
    bookingStatus: "completed",
    meetLink: "https://meet.google.com/rel-vlog-kickoff",
    emailSubject: "Contract Signed & Project Kickoff",
    isRead: true,
    isStarred: false,
    emailHistory: [
      {
        id: "EM-5",
        date: "2026-10-05 02:10 PM",
        sender: "David Kim",
        senderEmail: "dkim@verticallogistics.io",
        recipientEmail: "care@relaunch.us",
        subject: "Contract Signed & Project Kickoff",
        body: "Signed agreement uploaded. Looking forward to sprint kickoff on Monday.",
      },
    ],
  },
];

export const initialAdminPages: AdminPageItem[] = [
  {
    id: "PG-1",
    path: "/",
    title: "Overview / Homepage",
    headline: "Marketing, AI & Digital Evolution.",
    subtitle: "A digital transformation partner delivering full-stack strategy, modern web architecture, and autonomous AI systems.",
    metaTitle: "ReLaunch · Digital Transformation, Brand Strategy & AI Studio",
    metaDescription: "Phoenix-based digital agency specializing in full-funnel marketing, brand architecture, and cutting-edge generative AI workflows.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-2",
    path: "/services",
    title: "Core Services (3 Pillars)",
    headline: "Everything Your Business Needs to Dominate.",
    subtitle: "Strategic Branding, Next-Gen Web Engineering, and Performance Media built for sustainable enterprise ROI.",
    metaTitle: "Core Services · ReLaunch Creative & Engineering Studio",
    metaDescription: "Explore our 3 foundational pillars: Strategy & Identity, Web Engineering & Apps, and Full-Funnel Performance Media.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-3",
    path: "/ai",
    title: "AI Solutions (8 Full Stack Engines)",
    headline: "AI Solutions Built for Real Business Growth.",
    subtitle: "From AI search visibility to custom automations and voice agents — the full stack of practical AI services engineered for small and growing businesses.",
    metaTitle: "AI Solutions & AEO/GEO Visibility · ReLaunch Studio",
    metaDescription: "Deploy autonomous AI intake agents, Generative Engine Optimization (GEO), voice dispatchers, and automated lead intelligence.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-4",
    path: "/work",
    title: "Our Work & Case Studies Gallery",
    headline: "Selected Work & Proven Impact.",
    subtitle: "A curated look at client transformations, custom booking portals, and brand redesigns that drove exponential scale.",
    metaTitle: "Case Studies & Portfolio · ReLaunch Studio Phoenix",
    metaDescription: "Real case studies with verified metrics: TurfLife, Apex Fitness, Carmen Collection, and NextPhase Logistics.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-5",
    path: "/social",
    title: "ReLaunch Social (Track A vs B)",
    headline: "Social Media That Builds Equity & Closes Deals.",
    subtitle: "Stop posting into the void. We engineer high-converting short-form video, thought-leadership carousels, and paid social distribution.",
    metaTitle: "Social Media Management & Paid Distribution · ReLaunch",
    metaDescription: "Organic social content production and high-ROAS paid campaign architecture.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-6",
    path: "/pricing",
    title: "Transparent Pricing & Bundle Calculator",
    headline: "Transparent Plans. Zero Long-Term Lock-Ins.",
    subtitle: "Predictable monthly pricing with 100% asset ownership and month-to-month flexibility. Build your custom studio bundle.",
    metaTitle: "Pricing & Plans · Month-to-Month Subscriptions · ReLaunch",
    metaDescription: "Explore Starter, Growth, and Scale plans with our interactive multi-service bundle discount calculator.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-7",
    path: "/about",
    title: "About Us · 22 Years Heritage",
    headline: "22 Years of Craft, Speed & Reliability.",
    subtitle: "Founded in 2004 in Phoenix, AZ. We combine the agility of modern AI tools with two decades of battle-tested marketing discipline.",
    metaTitle: "About ReLaunch · Phoenix Digital Agency Founded 2004",
    metaDescription: "Meet the team and learn our history: from early digital agencies in 2004 to today's premier AI and creative studio.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-8",
    path: "/faq",
    title: "Knowledge Base & FAQs",
    headline: "Frequently Asked Questions.",
    subtitle: "Clear answers on how we work, turnaround timelines, billing terms, asset ownership, and AI implementation.",
    metaTitle: "FAQ & Studio Guidelines · ReLaunch Phoenix",
    metaDescription: "Common questions about onboarding, deliverables, contract terms, and AI technology stack answered.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
  {
    id: "PG-9",
    path: "/method",
    title: "Methodology & Framework",
    headline: "Our 4-Phase Evolution Framework.",
    subtitle: "Discovery, Architecture, Engineering, and Autonomous Scale.",
    metaTitle: "Method & Framework · ReLaunch Phoenix",
    metaDescription: "The engineering method behind ReLaunch digital transformation.",
    status: "Under Dev",
    lastModified: "2026-10-08",
  },
];

export const initialAdminMedia: AdminMediaAsset[] = [
  {
    id: "MED-1",
    name: "Homepage Hero Background Video",
    type: "video",
    url: "/relaunch-hero.mp4",
    size: "14.2 MB",
    resolution: "1920 × 1080 (60fps)",
    usedIn: "Homepage Video Hero",
    uploadedDate: "Oct 06, 2026",
  },
  {
    id: "MED-2",
    name: "AI Solutions Page Ambient Video",
    type: "video",
    url: "/aipage.mp4",
    size: "11.8 MB",
    resolution: "1920 × 1080 (60fps)",
    usedIn: "AI Solutions Video Hero",
    uploadedDate: "Oct 06, 2026",
  },
  {
    id: "MED-3",
    name: "TurfLife Case Study Showcase",
    type: "image",
    url: "/showcase/turflife.jpg",
    size: "840 KB",
    resolution: "1600 × 1000",
    usedIn: "Case Studies / Our Work",
    uploadedDate: "Oct 05, 2026",
  },
  {
    id: "MED-4",
    name: "Apex Fitness Portal Redesign",
    type: "image",
    url: "/showcase/fitness.jpg",
    size: "720 KB",
    resolution: "1600 × 1000",
    usedIn: "Case Studies / Our Work",
    uploadedDate: "Oct 05, 2026",
  },
  {
    id: "MED-5",
    name: "ReLaunch Compact Dark Logo",
    type: "logo",
    url: "/logos/logo-compact-dark.png",
    size: "42 KB",
    resolution: "320 × 64 (PNG Transparent)",
    usedIn: "Navbar, Footer, Admin Portal",
    uploadedDate: "Oct 01, 2026",
  },
];
