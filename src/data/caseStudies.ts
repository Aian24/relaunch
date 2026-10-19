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

  // Exact In-depth Case Study Narrative (from relaunch.us)
  challenge: string;
  strategy: string;
  resultsNarrative: string;
  
  // Highlighted Metrics
  statHighlights: { label: string; value: string; description?: string }[];
  
  // Compatibility fields for legacy components
  metricValue: string;
  metricLabel: string;
  tags: string[];
  icon: string;
  bgColor: string;
  description: string;
  clientQuote?: string;

  // Optional: a row of brands shown on the case page (used for multi-brand projects)
  brandShowcase?: {
    name: string;
    kind: string;
    logo: string;
    logoOnDark?: boolean;
    summary: string;
    made: string[];
    samples: { src: string; alt: string }[];
  }[];
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
    subtitle: "Launch and grow a new restaurant brand",
    client: "Chicago Dogs 42",
    clientStakeholder: "Troy & Katherine Gaines",
    location: "Omaha, NE",
    industry: "Restaurant",
    category: "Small business",
    period: "Ongoing",
    timeline: "Ongoing",
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
      "One small diner in a struggling Omaha mall. The owners wanted to turn it into a 1950s-style diner with a modern twist, and grow it well beyond one location.",
    strategy:
      "We were part of every step from day one: business development, branding, social media, Facebook ads, video, PR and software, all built around the owners' vision.",
    resultsNarrative:
      "Within 18 months the single mall location grew to 3 locations and 5 more food concepts. Revenue went from $150K in year 1 to $450K in year 2, and by year 3 it was a national franchise brand.",
    tags: ["Strategy", "Branding", "Social media", "Paid ads"],
    icon: "Utensils",
    bgColor: "#090D16",
    image: "/showcase/chicago_dog_real_1.jpg",
    galleryImages: [
      { src: "/showcase/chicago_dog_real_1.jpg", alt: "Chicago Dogs 42 storefront and diners", caption: "Flagship Omaha diner location" },
      { src: "/showcase/chicago_dog_real_2.png", alt: "Chicago Dogs 42 menu and digital ordering", caption: "Custom digital menu & campaign graphics" },
      { src: "/showcase/chicago_dog_real_3.png", alt: "Chicago Dogs 42 social ads creative", caption: "Paid Facebook campaign creative" },
      { src: "/showcase/chicago_dog.jpg", alt: "Chicago Dogs 42 interior ambiance", caption: "Modern 1950s diner brand experience" },
    ],
    displayUrl: "chicagodog42.com",
    statHighlights: [
      { label: "1st Year Revenue", value: "$150,000", description: "Initial baseline during launch period" },
      { label: "2nd Year Revenue", value: "$450,000", description: "Tripled revenue in Year 2" },
      { label: "Expansion", value: "3 Locations", description: "3 Locations and 5 food concepts in 18 months" },
      { label: "3rd Year", value: "National Franchise", description: "Scaled into a national franchise brand" },
    ],
  },
  {
    id: "carmen-hotel",
    slug: "carmen-hotel",
    aliases: ["the-carmen-hotel"],
    themeColor: "purple",
    heroVideo: "/videos/carmen-hotel-hero.mp4",
    bodyVideo: "/videos/carmen-hotel-body.mp4",
    title: "The Carmen Hotel",
    subtitle: "Brand voice, look and social presence for a boutique hotel",
    client: "The Carmen Hotel",
    clientStakeholder: "Sagebrush Companies",
    location: "Playa del Carmen, Mexico",
    industry: "Hospitality",
    category: "Small business",
    period: "2017",
    timeline: "6-month project (2017)",
    headlineNumber: "Brand presence for a boutique resort",
    hasNumberBadge: false,
    metricValue: "Brand",
    metricLabel: "Hospitality",
    story: "A boutique hotel in Playa del Carmen needed its online presence to feel as good as a stay there. We shaped a consistent brand voice and look across Facebook, Instagram and Twitter, produced video, and built a social presence around real guest moments. Guest-shared content became the heart of the brand.",
    description: "A consistent brand voice, look and social presence for a boutique hotel in Playa del Carmen, built around real guest moments.",
    services: [
      "Brand voice",
      "Social media",
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
    challenge: "The hotel needed its online presence to match the experience of staying there, and to give guests a reason to book direct.",
    strategy: "We built one brand voice and visual style across Facebook, Instagram and Twitter, produced video, consulted on the guest experience, and ran paid social to put the brand in front of travelers.",
    resultsNarrative: "A consistent, recognizable brand across every channel. Real guest moments became the center of the hotel’s story, and guest-shared content outperformed branded posts.",
    statHighlights: [
      { label: "Focus", value: "Brand", description: "One voice and look across every channel" },
      { label: "Channels", value: "3 Platforms", description: "Facebook, Instagram and Twitter" },
      { label: "Content", value: "Guest-led", description: "Real guest moments at the center of the story" },
      { label: "Program", value: "6 Months", description: "2017 engagement" },
    ],
    tags: ["Brand voice", "Social media", "Video", "Guest experience"],
    icon: "Hotel",
    bgColor: "#090D16",
    image: "/showcase/carmen_hotel_real_1.jpg",
    galleryImages: [
      { src: "/showcase/carmen_hotel_real_1.jpg", alt: "The Carmen Hotel beachfront architecture", caption: "Boutique beachfront property in Playa del Carmen" },
      { src: "/showcase/carmen_hotel_real_2.jpg", alt: "Carmen Hotel poolside social experience", caption: "Lifestyle guest-experience creative campaigns" },
      { src: "/showcase/carmen_hotel_real_3.png", alt: "Carmen Hotel social media advertising", caption: "Instagram & Facebook ad creative" },
      { src: "/showcase/carmen_hotel_real_4.png", alt: "The Carmen Hotel beachfront", caption: "The hotel on the beach in Playa del Carmen" },
    ],
    displayUrl: "carmenhotel.com",
  },
  {
    id: "jacksonville",
    slug: "property-appraiser",
    aliases: ["jacksonville", "city-of-jacksonville", "property-appraiser"],
    themeColor: "purple",
    title: "Property Appraiser Software Development",
    subtitle: "Replace a county property appraisal system from 1998",
    client: "City of Jacksonville",
    clientStakeholder: "City of Jacksonville, Florida – Duval County",
    location: "Duval County, FL",
    industry: "Government",
    category: "Custom software",
    period: "2019",
    timeline: "6 months (March–August 2019)",
    headlineNumber: "Delivered 1 month early · +65% user engagement",
    hasNumberBadge: true,
    metricValue: "+65%",
    metricLabel: "User Engagement",
    story:
      "The county's property appraisal system dated back to 1998. We built a modern replacement that staff could use easily and that connects with other county departments. It led to more work with the city.",
    description:
      "Modern software to replace a county property appraisal system from 1998, delivered a month ahead of schedule.",
    services: [
      "Custom software",
      "Systems integration",
    ],
    fullDeliverables: [
      "Enterprise Architectural Software Development",
      "Entity Network Framework system for public record keeping",
      "Connections to other Duval County departments",
      "Replacement of the 1998 appraisal system",
    ],
    challenge:
      "Duval County's property appraisal system dated back to 1998. The City of Jacksonville needed a replacement that was easy for staff to use and worked across the county's departments.",
    strategy:
      "We built modern software that connects the appraisal system to other county departments, designed around the people who use it every day.",
    resultsNarrative:
      "Built in 3 months, tested and debugged in 1, and delivered a month ahead of schedule. User engagement rose 65%, which opened the door to more projects with the city.",
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
    statHighlights: [
      { label: "Delivery", value: "1 Month Early", description: "Delivered a month earlier than agreed" },
      { label: "Engagement", value: "65%", description: "Increase in user engagement and experience" },
      { label: "Replaced", value: "1998 System", description: "Modernized a 20-year-old county system" },
      { label: "Timeline", value: "3 Months", description: "Developed in 3 months, debugged in 1" },
    ],
  },
  {
    id: "micro-brands",
    slug: "micro-brands",
    aliases: ["food-brands", "restaurant-brands"],
    themeColor: "purple",
    title: "Food Court Micro-Brands",
    subtitle: "Four food concepts, branded from name to storefront",
    client: "Food Court Micro-Brands",
    location: "Omaha, NE",
    industry: "Restaurants",
    category: "Websites & brand",
    period: "Brand creation",
    timeline: "Brand creation",
    headlineNumber: "4 brands created from scratch",
    hasNumberBadge: true,
    metricValue: "4 Brands",
    metricLabel: "Created from scratch",
    story:
      "Four food concepts that each needed to stand out on their own. We named them, designed the logos, built the storefronts and counters, wrote the menus and signage, and ran their social media.",
    description:
      "Four restaurant micro-brands, from ice cream to grilled cheese to a beer bar, each named, designed and launched by ReLaunch.",
    services: ["Naming", "Logos", "Space design", "Social media"],
    fullDeliverables: [
      "Brand naming",
      "Logo design and brand identity",
      "Mascot illustration",
      "Storefront and interior design",
      "Menu boards and signage",
      "Menu item naming",
      "Social media content",
    ],
    challenge:
      "Four new concepts: an ice cream shop, a grilled cheese and shake counter, a beer bar and a Hawaiian-style hot dog stand. Each needed a personality strong enough to win over a passer-by in a few seconds, and a look that worked everywhere from a logo to a full storefront.",
    strategy:
      "We gave every concept its own name, logo and color world, then carried it into the physical space: storefront facades, an ice cream counter wrapped in waffle-cone graphics, a barrel-shaped tap wall, menu boards and signage. Social posts introduced signature menu items with playful names like The Big Cheezi and the Zourdough Jack.",
    resultsNarrative:
      "Four finished brands, each recognizable on its own: Walt & Willy's Creamery, Get Cheezi, Berlin Barrel and Haweenie's. Every piece, from the logo to the storefront to the menu posts, was created by ReLaunch.",
    statHighlights: [
      { label: "Brands", value: "4", description: "Each with its own name, logo and look" },
      { label: "Scope", value: "Name to storefront", description: "Identity, space, signage and social" },
      { label: "Mascot", value: "1", description: "Custom character for Haweenie's" },
      { label: "Content", value: "Menu posts", description: "Signature items introduced on social" },
    ],
    tags: ["Naming", "Logos", "Space design", "Social media"],
    icon: "Store",
    bgColor: "#090D16",
    image: "/showcase/microbrands/food-hall-storefronts.webp",
    galleryImages: [
      { src: "/showcase/microbrands/food-hall-storefronts.webp", alt: "Storefronts designed for the food concepts", caption: "Storefront facades, each in its own brand colors" },
      { src: "/showcase/microbrands/walt-willys-bar.webp", alt: "Walt & Willy's Creamery ice cream counter", caption: "Walt & Willy's counter wrapped in waffle-cone and sprinkle graphics" },
      { src: "/showcase/microbrands/berlin-barrel-taps.webp", alt: "Berlin Barrel barrel-shaped tap wall", caption: "Berlin Barrel's barrel-shaped tap wall" },
      { src: "/showcase/microbrands/walt-willys-counter.webp", alt: "Walt & Willy's Creamery menu boards and counter", caption: "Menu boards and opening-day screens" },
    ],
    displayUrl: "Food court micro-brands",
    brandShowcase: [
      {
        name: "Walt & Willy's Creamery",
        kind: "Ice cream & treats",
        logo: "/showcase/microbrands/walt-willys-creamery-logo.webp",
        summary: "A playful, old-time sweet shop with a top hat, a derby and a counter that looks like it's melting.",
        made: ["Name & logo", "Counter design", "Menu boards"],
        samples: [
          { src: "/showcase/microbrands/walt-willys-logo.webp", alt: "Walt & Willy's script logo" },
          { src: "/showcase/microbrands/walt-willys-bar.webp", alt: "Walt & Willy's ice cream counter" },
        ],
      },
      {
        name: "Get Cheezi",
        kind: "Grilled cheese & shakes",
        logo: "/showcase/microbrands/get-cheezi-logo.webp",
        summary: "A melting-cheese heart and a menu of punny signature items, launched one post at a time.",
        made: ["Name & logo", "Menu item names", "Social posts"],
        samples: [
          { src: "/showcase/microbrands/get-cheezi-big-cheezi.webp", alt: "The Big Cheezi social post" },
          { src: "/showcase/microbrands/get-cheezi-zourdough-jack.webp", alt: "Zourdough Jack social post" },
          { src: "/showcase/microbrands/get-cheezi-frooty-blaster.webp", alt: "Frooty Blaster shake social post" },
          { src: "/showcase/microbrands/get-cheezi-pasta.webp", alt: "Fresh handmade pasta social post" },
        ],
      },
      {
        name: "Berlin Barrel",
        kind: "Beer bar",
        logo: "/showcase/microbrands/berlin-barrel-logo.webp",
        logoOnDark: false,
        summary: "An old-world beer hall badge in black and gold, built into a barrel-shaped tap wall.",
        made: ["Name & logo", "Tap wall design", "Signage"],
        samples: [
          { src: "/showcase/microbrands/berlin-barrel-taps.webp", alt: "Berlin Barrel tap wall" },
        ],
      },
      {
        name: "Haweenie's",
        kind: "Hawaiian-style hot dogs",
        logo: "/showcase/microbrands/haweenies-logo.webp",
        logoOnDark: true,
        summary: "Island sunset colors, a pineapple-topped dog and a shaka-throwing mascot ready for a food truck.",
        made: ["Name & logo", "Mascot", "Social posts"],
        samples: [
          { src: "/showcase/microbrands/haweenies-mascot.webp", alt: "Haweenie's mascot" },
          { src: "/showcase/microbrands/haweenies-food-truck.webp", alt: "Haweenie's food truck social post" },
        ],
      },
    ],
  },
  {
    id: "turflife",
    slug: "turflife-2",
    aliases: ["turflife", "turflife-2"],
    themeColor: "purple",
    title: "Turflife",
    subtitle: "Build a lifestyle brand for the turf industry",
    client: "Terrie Purdum",
    clientStakeholder: "Terrie Purdum (Golf Central Magazine)",
    location: "Winter Springs, FL",
    industry: "Lifestyle brand",
    category: "Websites & brand",
    period: "2016–present",
    timeline: "2016–present",
    headlineNumber: "Mentioned nationally across the turf industry",
    hasNumberBadge: true,
    metricValue: "National",
    metricLabel: "Brand Movement",
    story:
      "The founder of Golf Central Magazine wanted a lifestyle brand to take on the biggest names in the category. We built the brand identity, website and social channels behind \"Protect Your Turf\", now recognized by the turf industry nationwide.",
    description:
      "A lifestyle brand for the turf industry, built from scratch for the publisher of the largest golf and lifestyle magazine in the Southeast. We created the brand, the website and the social channels behind \"Protect Your Turf\".",
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
      "Golf Central Magazine's founder wanted a lifestyle brand that could stand up to Salt Life, built around a \"Protect Your Turf\" spirit for the turf industry and the sports played on turf.",
    strategy:
      "We created the brand, the website and the social media accounts, then built steady mentions from the turf industry and sports teams across the country.",
    resultsNarrative:
      "TurfLife is mentioned across the country by the turf industry and most sports played on turf, with partnerships with soccer clubs and football teams in view.",
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
    statHighlights: [
      { label: "Status", value: "Since 2016", description: "On-Going national movement" },
      { label: "Recognition", value: "Nationwide", description: "Recognized by the turf industry nationwide" },
      { label: "Movement", value: "Protect Your Turf", description: "Iconic lifestyle brand" },
      { label: "Partnerships", value: "Expanding", description: "Future partnerships with clubs and teams" },
    ],
  },
  {
    id: "swing-perfect",
    slug: "swing-perfect",
    aliases: ["swing-perfect-app"],
    themeColor: "purple",
    title: "Swing Perfect",
    subtitle: "Build a first-of-its-kind golf app",
    client: "Clayton Randolph",
    clientStakeholder: "Clayton Randolph",
    location: "National",
    industry: "Golf technology",
    category: "Custom software",
    period: "2 Months Build",
    timeline: "6-month contract",
    headlineNumber: "App built in 2 months · Business sold to Golf Galaxy",
    hasNumberBadge: true,
    metricValue: "Acquired",
    metricLabel: "By Golf Galaxy",
    story:
      "A golf-industry founder needed an app nobody had built before. We designed and built it for iPhone and Android in 2 months, then supported sales. The business was later sold to Golf Galaxy.",
    description:
      "A first-of-its-kind golf app for iPhone and Android, built in 2 months. The business was later sold to Golf Galaxy.",
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
      "Build a mobile app that reads millions of handwriting styles, letters and numbers, and uses that data to help golfers improve their swing.",
    strategy:
      "We built the app for iPhone and Android in 2 months, tested it for the rest of the contract, and supplied cold calling and sales agents to help sell it.",
    resultsNarrative:
      "The app was built in 2 months and tested successfully. The business was later sold to Golf Galaxy.",
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
    statHighlights: [
      { label: "Client Satisfaction", value: "100%", description: "100% Client Satisfaction & Usage" },
      { label: "Delivery Time", value: "2 Months", description: "Mobile app developed in 2 months" },
      { label: "Acquisition", value: "Golf Galaxy", description: "The business was sold to Golf Galaxy" },
      { label: "Platforms", value: "iOS & Android", description: "Built for iPhone and Android" },
    ],
  },
  {
    id: "aspiration-bank",
    slug: "aspiration-bank",
    aliases: ["aspiration"],
    themeColor: "purple",
    title: "Web Developer and Designer for Aspiration Bank",
    subtitle: "Website design and build (2015–2017)",
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
      "Create a website that makes people want to bank sustainably, matching the company's vision for an eco-conscious digital bank.",
    strategy:
      "We worked closely with the executive team and turned their goals into a clear, engaging website.",
    resultsNarrative: "Increased website traffic 200% year over year, with record traffic and sign-ups after launch.",
    tags: ["Brand story", "Web design", "Web development"],
    icon: "Landmark",
    bgColor: "#090D16",
    image: "/showcase/aspiration_real_1.png",
    galleryImages: [
      { src: "/showcase/aspiration_real_1.png", alt: "Aspiration Bank digital homepage experience", caption: "Website design and build" },
      { src: "/showcase/aspiration_real_2.png", alt: "Aspiration Bank interactive impact calculator", caption: "Interactive tool showing consumer climate impact" },
      { src: "/showcase/aspiration_real_3.png", alt: "Aspiration Bank mobile banking interface", caption: "Sleek mobile responsive customer onboarding" },
      { src: "/showcase/aspiration_real_4.png", alt: "Aspiration Bank card lifestyle showcase", caption: "Plant-based debit card product launch showcase" },
    ],
    displayUrl: "aspiration.com",
    statHighlights: [
      { label: "YoY Traffic", value: "200%", description: "Increased traffic year-over-year" },
      { label: "Sign-Up Growth", value: "Record High", description: "Record traffic and subscription growth" },
      { label: "Mission Impact", value: "Leader", description: "Established as leader in purpose-driven marketing" },
      { label: "Timeline", value: "2015 – 2017", description: "2-year partnership" },
    ],
  },
];

export const clientLogos = [
  "Aspiration Bank",
  "City of Jacksonville",
  "TurfLife",
  "Golf Central Magazine",
  "Swing Perfect",
  "Chicago Dogs 42",
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
