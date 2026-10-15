export type CaseStudyTheme = "orange" | "purple";

export interface CaseStudy {
  id: string;
  slug: string;
  aliases?: string[];
  themeColor: CaseStudyTheme;
  title: string;
  subtitle: string;
  client: string;
  clientStakeholder?: string;
  location: string;
  category: "Small business" | "Websites & brand" | "Custom software";
  industry: string;
  period?: string;
  timeline: string;
  headlineNumber: string;
  hasNumberBadge: boolean;
  story: string;
  services: string[]; // Super short details for card labels (e.g. Strategy, Branding)
  fullDeliverables: string[]; // Exact services provided from relaunch.us
  image: string;
  heroVideo?: string; // Only populated if relaunch.us has a video
  bodyVideo?: string; // Optional body video from relaunch.us
  galleryImages: { src: string; alt: string; caption?: string }[];
  displayUrl: string;
  liveUrl?: string;

  // Exact In-depth Case Study Narrative (from relaunch.us)
  challenge: string;
  strategy: string;
  resultsNarrative: string;
  
  // Highlighted Metrics
  statHighlights: { label: string; value: string; description?: string }[];
  
  // Testimonial
  testimonialQuote?: {
    quote: string;
    author: string;
    role?: string;
  };

  // Compatibility fields for legacy components
  metricValue: string;
  metricLabel: string;
  tags: string[];
  icon: string;
  bgColor: string;
  description: string;
  clientQuote?: string;
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: "chicago-dog-42",
    slug: "chicago-dog-42",
    aliases: ["chicago-dogs-42"],
    themeColor: "purple",
    heroVideo: "/videos/chicago-dog-hero.mp4",
    bodyVideo: "/videos/chicago-dog-pr.mp4",
    title: "Chicago Dogs 42",
    subtitle: "Troy & Katherine Gaines On-going Project",
    client: "Chicago Dogs 42",
    clientStakeholder: "Troy & Katherine Gaines",
    location: "Omaha, NE",
    industry: "Restaurant",
    category: "Small business",
    period: "On-going Project",
    timeline: "On-going Project",
    headlineNumber: "$150K → $450K in revenue, year 1 to year 2",
    hasNumberBadge: true,
    metricValue: "$150K → $450K",
    metricLabel: "Revenue Growth",
    story:
      "The owners had a clear vision and brought us in from day one. We handled business development, branding, social media, Facebook ads, video, PR and software. By year 3 it had become a national franchise brand.",
    description:
      "The owners had a clear vision and brought us in from day one. We handled business development, branding, social media, Facebook ads, video, PR and software.",
    services: [
      "Strategy",
      "Branding",
      "Social media",
      "Paid ads",
      "Video",
      "PR",
      "Software",
    ],
    fullDeliverables: [
      "Business Consultation & Development",
      "Social Media Content Creation and Management",
      "Paid Social Media Ads (Facebook)",
      "Ad Design and Testing",
      "Graphic Design",
      "Public Relations",
      "Branding",
      "Video Creation & Development",
      "Community Management & Customer Management",
      "Software Development",
      "Performance Report & Optimization",
    ],
    challenge:
      "Taking a single small location in a dying mall in Omaha, Nebraska and expanding it with a friendly, organic-feeling 1950’s diner with a modern twist.",
    strategy:
      "ReLaunch Advertising was involved in every step of the way right from the start, executing a specific owner vision with social media, branding, ads, PR, and software.",
    resultsNarrative:
      "Took a single small location in a dying mall in Omaha, Nebraska to 3 Locations and 5 other food concepts all within a span of 18 months, becoming a national franchise brand.",
    tags: ["Strategy", "Branding", "Social media", "Paid ads"],
    icon: "Utensils",
    bgColor: "#090D16",
    image: "/showcase/chicago_dog_real_1.jpg",
    galleryImages: [
      { src: "/showcase/chicago_dog_real_1.jpg", alt: "Chicago Dogs 42 storefront and diners", caption: "Flagship Omaha diner location" },
      { src: "/showcase/chicago_dog_real_2.png", alt: "Chicago Dogs 42 menu and digital ordering", caption: "Custom digital menu & campaign graphics" },
      { src: "/showcase/chicago_dog_real_3.png", alt: "Chicago Dogs 42 social ads creative", caption: "High-converting paid Facebook campaigns" },
      { src: "/showcase/chicago_dog.jpg", alt: "Chicago Dogs 42 interior ambiance", caption: "Modern 1950s diner brand experience" },
    ],
    displayUrl: "chicagodog42.com",
    liveUrl: "https://chicagodog42.com",
    statHighlights: [
      { label: "1st Year Revenue", value: "$150,000", description: "Initial baseline during launch period" },
      { label: "2nd Year Revenue", value: "$450,000", description: "Tripled revenue in Year 2" },
      { label: "Expansion", value: "3 Locations", description: "3 Locations and 5 food concepts in 18 months" },
      { label: "3rd Year", value: "National Franchise", description: "Scaled into a national franchise brand" },
    ],
    testimonialQuote: {
      quote:
        "This is one of our best projects we have been a part of. Our Agency ReLaunch Advertising was involved in every step of the way right from the start. The owner had a very specific vision in mind of what his business would look like – not only did we deliver, but greatly exceeded expectations.",
      author: "Troy & Katherine Gaines / ReLaunch Advertising",
      role: "Chicago Dogs 42 Owners",
    },
  },
  {
    id: "carmen-hotel",
    slug: "carmen-hotel",
    aliases: ["the-carmen-hotel"],
    themeColor: "purple",
    heroVideo: "/videos/carmen-hotel-hero.mp4",
    bodyVideo: "/videos/carmen-hotel-body.mp4",
    title: "The Carmen Hotel",
    subtitle: "Sagebrush Companies 6-month Project (2017)",
    client: "The Carmen Hotel",
    clientStakeholder: "Sagebrush Companies",
    location: "Playa del Carmen, Mexico",
    industry: "Hospitality",
    category: "Small business",
    period: "2017",
    timeline: "6-month Project (2017)",
    headlineNumber: "6-month social and paid ads program",
    hasNumberBadge: false,
    metricValue: "6-month",
    metricLabel: "Program",
    story:
      "The hotel was struggling with low bookings and guest satisfaction. We ran a 6-month social media and paid ads program on Facebook and Instagram, with video, guest-experience consulting and community management. Paid ads drove site traffic and bookings, and real guest content outperformed branded posts.",
    description:
      "Develop and execute social media marketing strategy for the Carmen Hotel located in Playa del Carmen, Mexico, Quintana Roo.",
    services: [
      "Social media",
      "Paid ads",
      "Video",
      "Guest experience",
    ],
    fullDeliverables: [
      "Guest Experience Consultation",
      "Social media content creation and management (Facebook, Instagram, Twitter)",
      "Paid Social Media Ads (Facebook/Instagram ads)",
      "Ad Design & Testing",
      "Performance Reporting & Optimization",
      "Community management and customer engagement",
      "Video Creation and Development",
    ],
    challenge:
      "The challenge of this project was low booking rates and guest satisfaction for The Carmen Hotel located in Playa del Carmen, Mexico, Quintana Roo.",
    strategy:
      "Develop and execute social media marketing strategy, paid social ads, ad design, and guest experience consultation.",
    resultsNarrative:
      "Generated 15% lift in online bookings, grew social media followers by 20% (10k new followers), and 30% increase in website traffic.",
    tags: ["Social media", "Paid ads", "Video", "Guest experience"],
    icon: "Hotel",
    bgColor: "#090D16",
    image: "/showcase/carmen_hotel_real_1.jpg",
    galleryImages: [
      { src: "/showcase/carmen_hotel_real_1.jpg", alt: "The Carmen Hotel beachfront architecture", caption: "Boutique beachfront property in Playa del Carmen" },
      { src: "/showcase/carmen_hotel_real_2.jpg", alt: "Carmen Hotel poolside social experience", caption: "Lifestyle guest-experience creative campaigns" },
      { src: "/showcase/carmen_hotel_real_3.png", alt: "Carmen Hotel social media advertising", caption: "Direct booking Instagram & Facebook ad sets" },
      { src: "/showcase/carmen_hotel_real_4.png", alt: "Carmen Hotel engagement analytics", caption: "+10,000 new verified traveler followers" },
    ],
    displayUrl: "carmenhotel.com",
    liveUrl: "https://carmenhotel.com",
    statHighlights: [
      { label: "Lift in Bookings", value: "15%", description: "Lift in direct online reservations" },
      { label: "Follower Growth", value: "20%", description: "10k new verified travel followers" },
      { label: "Website Traffic", value: "30%", description: "Increase in website traffic" },
      { label: "Total Profit", value: "$87,500", description: "Direct profit generated from campaigns" },
    ],
    testimonialQuote: {
      quote:
        "The challenge of this project was low booking rates and guest satisfaction. ReLaunch came in with a social media marketing strategy and guest experience consultation that turned around our numbers.",
      author: "Sagebrush Companies",
      role: "Asset Management Group, The Carmen Hotel",
    },
  },
  {
    id: "jacksonville",
    slug: "property-appraiser",
    aliases: ["jacksonville", "city-of-jacksonville", "property-appraiser"],
    themeColor: "purple",
    title: "Property Appraiser Software Development",
    subtitle: "City of Jacksonville, Florida – Duval County 6-months (March-August 2019)",
    client: "City of Jacksonville",
    clientStakeholder: "City of Jacksonville, Florida – Duval County",
    location: "Duval County, FL",
    industry: "Government",
    category: "Custom software",
    period: "2019",
    timeline: "6-months (March-August 2019)",
    headlineNumber: "Delivered 1 month early · +65% user engagement",
    hasNumberBadge: true,
    metricValue: "+65%",
    metricLabel: "User Engagement",
    story:
      "The county's property appraisal system dated back to 1998. We built a modern replacement that staff could use easily and that connects with other county departments. It led to more work with the city.",
    description:
      "The City of Jacksonville sent out a bid to update their property appraisal system built in 1998, requiring an easy-to-use system for end users and different departments within Duval County.",
    services: [
      "Custom software",
      "Systems integration",
    ],
    fullDeliverables: [
      "Enterprise Architectural Software Development",
      "Entity Network Framework system for public record keeping",
      "GIS Parcel Search and Tax Assessment Tools",
      "Cross-Department Municipal API Integration",
      "Legacy Database Migration (1998 System)",
    ],
    challenge:
      "The City of Jacksonville sent out a bid to update their property appraisal system built in 1998, requiring an easy-to-use system for end users and different departments within Duval County.",
    strategy:
      "Used available technology to create an enterprise architectural software and entity network framework system delivered 1 month earlier than agreed.",
    resultsNarrative:
      "Software developed in 3 months, functional and debugged in 1, delivered a month earlier. Generated 65% increase in user engagement and experience, opening opportunities for further projects with the City of Jacksonville.",
    tags: ["Custom software", "Systems integration", "Civic Portal"],
    icon: "Building2",
    bgColor: "#090D16",
    image: "/showcase/jacksonville_real_1.jpg",
    galleryImages: [
      { src: "/showcase/jacksonville_real_1.jpg", alt: "Duval County Property Appraiser modern interface", caption: "Re-engineered search portal for Duval County citizens" },
      { src: "/showcase/jacksonville_real_3.png", alt: "Property appraisal record search system", caption: "Instant parcel lookup & tax assessment data visualizer" },
      { src: "/showcase/jacksonville_real_2.png", alt: "Jacksonville civic software architecture", caption: "Robust Entity Network Framework backend" },
      { src: "/showcase/jacksonville_real_4.png", alt: "Municipal interface responsive design", caption: "Mobile-responsive citizen records portal" },
    ],
    displayUrl: "propertyappraiser.gov",
    liveUrl: "https://coj.net",
    statHighlights: [
      { label: "Delivery", value: "1 Month Early", description: "Delivered a month earlier than agreed" },
      { label: "Engagement", value: "65%", description: "Increase in user engagement and experience" },
      { label: "Winning Bid", value: "$65,000", description: "Budget allocated was $85,000" },
      { label: "Timeline", value: "3 Months", description: "Developed in 3 months, debugged in 1" },
    ],
    testimonialQuote: {
      quote:
        "It was a pleasure working with a government agency and helping the general public access a more robust and user friendly system. This project demonstrates how even a large government organization can benefit from a small marketing and software development agency.",
      author: "City of Jacksonville / ReLaunch",
      role: "Duval County Civic Project Review",
    },
  },
  {
    id: "aspiration-bank",
    slug: "aspiration-bank",
    aliases: ["aspiration"],
    themeColor: "purple",
    title: "Web Developer and Designer for Aspiration Bank",
    subtitle: "Aspiration Bank (2015 – 2017)",
    client: "Aspiration Bank",
    clientStakeholder: "Aspiration Executive Team",
    location: "National",
    industry: "Online banking",
    category: "Websites & brand",
    period: "2015–2017",
    timeline: "2015 – 2017",
    headlineNumber: "+200% website traffic, year over year",
    hasNumberBadge: true,
    metricValue: "+200%",
    metricLabel: "Website Traffic YoY",
    story:
      "A new values-based bank needed to stand out in a crowded market. We turned loose ideas into one clear brand story and designed and built the website, which drew record traffic and sign-ups after launch.",
    description:
      "A new values-based bank needed to stand out in a crowded market. We turned loose ideas into one clear brand story and designed and built the website.",
    services: [
      "Brand story",
      "Web design",
      "Web development",
    ],
    fullDeliverables: [
      "Web Development",
      "Web Design",
      "Stakeholder Unification",
      "User Experience Consultation",
    ],
    challenge:
      "Our mandate was to create a user experience that inspires people to bank sustainably, matching their disruptive vision for an eco-conscious digital bank.",
    strategy:
      "Selected by executive team, drove a collaborative design process unifying stakeholders and translating bold aspirations into an engaging online presence connecting emotionally with customers.",
    resultsNarrative:
      "Increased traffic by 200% year-over-year, drew record traffic and subscription growth, established agency as a leader in purpose-driven marketing.",
    tags: ["Brand story", "Web design", "Web development"],
    icon: "Landmark",
    bgColor: "#090D16",
    image: "/showcase/aspiration_real_1.png",
    galleryImages: [
      { src: "/showcase/aspiration_real_1.png", alt: "Aspiration Bank digital homepage experience", caption: "High-converting web experience built for sustainable banking" },
      { src: "/showcase/aspiration_real_2.png", alt: "Aspiration Bank interactive impact calculator", caption: "Interactive tool showing consumer climate impact" },
      { src: "/showcase/aspiration_real_3.png", alt: "Aspiration Bank mobile banking interface", caption: "Sleek mobile responsive customer onboarding" },
      { src: "/showcase/aspiration_real_4.png", alt: "Aspiration Bank card lifestyle showcase", caption: "Plant-based debit card product launch showcase" },
    ],
    displayUrl: "aspiration.com",
    liveUrl: "https://aspiration.com",
    statHighlights: [
      { label: "YoY Traffic", value: "200%", description: "Increased traffic year-over-year" },
      { label: "Sign-Up Growth", value: "Record High", description: "Record traffic and subscription growth" },
      { label: "Mission Impact", value: "Leader", description: "Established as leader in purpose-driven marketing" },
      { label: "Timeline", value: "2015 – 2017", description: "2-year partnership" },
    ],
    testimonialQuote: {
      quote:
        "Our successful partnership with Aspiration produced one of the first of many projects establishing our agency as a leader in purpose-driven marketing able to distill complex organization missions into compelling digital experiences. This achievement continues opening doors to work with conscientious companies worldwide.",
      author: "Aspiration Bank Executive Team / ReLaunch",
      role: "Strategic Partnership Review",
    },
  },
  {
    id: "turflife",
    slug: "turflife-2",
    aliases: ["turflife", "turflife-2"],
    themeColor: "purple",
    title: "Turflife",
    subtitle: "Terrie Purdum 2016 On-Going",
    client: "Terrie Purdum",
    clientStakeholder: "Terrie Purdum (Golf Central Magazine)",
    location: "Winter Springs, FL",
    industry: "Lifestyle brand",
    category: "Websites & brand",
    period: "2016–present",
    timeline: "2016 On-Going",
    headlineNumber: "Mentioned nationally across the turf industry",
    hasNumberBadge: true,
    metricValue: "National",
    metricLabel: "Brand Movement",
    story:
      "The founder of Golf Central Magazine wanted a lifestyle brand to take on the biggest names in the category. We built the brand identity, website and social channels behind \"Protect Your Turf\", now recognized by the turf industry nationwide.",
    description:
      "Terrie, owner and founder of Golf Central Magazine out of Winter Springs, Florida – has the largest golf and lifestyle magazine in the southeast. When she reached out to us with the idea to go head-to-head with the behemoth Salt Life brand, we knew this would be an amazing opportunity...",
    services: [
      "Brand identity",
      "Website",
      "Social media",
    ],
    fullDeliverables: [
      "Website Development",
      "Social Media Accounts Setup & Management",
      "Branding",
      "Partnership Development",
    ],
    challenge:
      "Going head-to-head with the behemoth Salt Life brand, representing the Protect Your Turf spirit for the turf industry and sports played on turf.",
    strategy:
      "Created a website, social media accounts, and basic brand, building consistent mentions across the country by the turf industry and sports teams.",
    resultsNarrative:
      "Consistently mentioned across the country by the turf industry and most sports played on turf; looking toward future partnerships with soccer clubs and football teams.",
    tags: ["Brand identity", "Website", "Social media"],
    icon: "Trees",
    bgColor: "#090D16",
    image: "/showcase/turflife_real_1.png",
    galleryImages: [
      { src: "/showcase/turflife_real_1.png", alt: "TurfLife official brand apparel and digital storefront", caption: "The Protect Your Turf digital lifestyle headquarters" },
      { src: "/showcase/turflife_real_5.png", alt: "TurfLife merchandise lineup", caption: "Iconic dog logo & lifestyle merchandise line" },
      { src: "/showcase/turflife_real_2.png", alt: "TurfLife social media campaign", caption: "National community campaign across turf industries" },
      { src: "/showcase/turflife_real_3.png", alt: "TurfLife brand showcase in Golf Central Magazine", caption: "Southeastern magazine feature syndication" },
    ],
    displayUrl: "turflife.com",
    liveUrl: "https://turflife.com",
    statHighlights: [
      { label: "Status", value: "Since 2016", description: "On-Going national movement" },
      { label: "Recognition", value: "Nationwide", description: "Recognized by the turf industry nationwide" },
      { label: "Movement", value: "Protect Your Turf", description: "Iconic lifestyle brand" },
      { label: "Partnerships", value: "Expanding", description: "Future partnerships with clubs and teams" },
    ],
    testimonialQuote: {
      quote:
        "Terrie, owner and founder of Golf Central Magazine out of Winter Springs, Florida – has the largest golf and lifestyle magazine in the southeast. When she reached out to us with the idea to go head-to-head with the behemoth Salt Life brand, we knew this would be an amazing opportunity...",
      author: "Terrie Purdum",
      role: "Owner and Founder, Golf Central Magazine",
    },
  },
  {
    id: "swing-perfect",
    slug: "swing-perfect",
    aliases: ["swing-perfect-app"],
    themeColor: "purple",
    title: "Swing Perfect",
    subtitle: "Clayton Randolph 6-months Contract",
    client: "Clayton Randolph",
    clientStakeholder: "Clayton Randolph",
    location: "National",
    industry: "Golf technology",
    category: "Custom software",
    period: "2 Months Build",
    timeline: "6-months Contract",
    headlineNumber: "App built in 2 months · Business sold to Golf Galaxy",
    hasNumberBadge: true,
    metricValue: "Acquired",
    metricLabel: "By Golf Galaxy",
    story:
      "A golf-industry founder needed an app nobody had built before. We designed and built it for iPhone and Android in 2 months, then supported sales. The business was later sold to Golf Galaxy.",
    description:
      "Clay found us online looking for a reliable agency that can develop a mobile application for his dream business in the golf industry. He wanted to create a mobile app that has never been done before...",
    services: [
      "Mobile app",
      "Business consulting",
      "Design",
      "Sales support",
    ],
    fullDeliverables: [
      "Mobile Application (iPhone & Android phones)",
      "Business Consultation",
      "Graphic Design",
      "Cold Calling Services",
      "Sales Agents",
    ],
    challenge:
      "Creating a mobile app that reads millions of different handwriting styles, letters and numbers and takes the dataset to improve golfers' swings.",
    strategy:
      "Developed mobile app in 2 months, tested for remaining time, provided cold calling services and sales agents.",
    resultsNarrative:
      "Mobile app developed in 2 months and tested successfully. 100% client satisfaction & usage. The business was sold to Golf Galaxy.",
    tags: ["Mobile app", "Business consulting", "Design"],
    icon: "Trophy",
    bgColor: "#090D16",
    image: "/showcase/swing_perfect_real_1.png",
    galleryImages: [
      { src: "/showcase/swing_perfect_real_1.png", alt: "Swing Perfect mobile app interface showcase", caption: "iOS and Android golf swing analyzer interface" },
      { src: "/showcase/swing_perfect_real_2.png", alt: "Swing Perfect data card reader screen", caption: "Handwriting & score card automated scanning engine" },
      { src: "/showcase/swing_perfect_real_3.png", alt: "Swing Perfect golf analytics dashboard", caption: "Personalized player swing improvement metrics" },
      { src: "/showcase/swing_perfect_real_4.png", alt: "Swing Perfect device mockup", caption: "Real-time range and clubhouse diagnostic tools" },
    ],
    displayUrl: "swingperfect.com",
    liveUrl: "https://swingperfect.com",
    statHighlights: [
      { label: "Client Satisfaction", value: "100%", description: "100% Client Satisfaction & Usage" },
      { label: "Delivery Time", value: "2 Months", description: "Mobile app developed in 2 months" },
      { label: "Acquisition", value: "Golf Galaxy", description: "The business was sold to Golf Galaxy" },
      { label: "Labor", value: "$3,700", description: "Budget $7,000, Bid $5,000, Labor $3,700" },
    ],
    testimonialQuote: {
      quote:
        "Clay found us online looking for a reliable agency that can develop a mobile application for his dream business in the golf industry. He wanted to create a mobile app that has never been done before...",
      author: "Clayton Randolph",
      role: "Founder, Swing Perfect",
    },
  },
];

export const clientLogos = [
  "Aspiration Bank",
  "City of Jacksonville",
  "TurfLife",
  "Golf Central Magazine",
  "Swing Perfect",
  "Chicago Dog 42",
  "Carmen Hotel",
  "Mother Truckin Burgers",
];

// Helper to look up case study by slug or alias
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const normalized = slug.toLowerCase().replace(/\/$/, "");
  return caseStudiesData.find(
    (cs) =>
      cs.slug.toLowerCase() === normalized ||
      cs.id.toLowerCase() === normalized ||
      cs.aliases?.some((a) => a.toLowerCase() === normalized)
  );
}

// Helper to retrieve all valid slugs for static routes
export function getAllCaseStudySlugs(): string[] {
  const slugs = new Set<string>();
  caseStudiesData.forEach((cs) => {
    slugs.add(cs.slug);
    slugs.add(cs.id);
    cs.aliases?.forEach((alias) => slugs.add(alias));
  });
  return Array.from(slugs);
}
