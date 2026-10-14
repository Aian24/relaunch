export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  category: "Small business" | "Websites & brand" | "Custom software";
  industry: string;
  period?: string;
  headlineNumber: string;
  hasNumberBadge: boolean;
  story: string;
  services: string[];
  image: string;
  displayUrl: string;
  liveUrl?: string;
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
    title: "Chicago Dog 42",
    client: "Chicago Dog 42",
    location: "Omaha, NE",
    industry: "Restaurant",
    category: "Small business",
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
    tags: ["Strategy", "Branding", "Social media", "Paid ads"],
    icon: "Utensils",
    bgColor: "#090D16",
    image: "/showcase/chicago_dog_real_1.jpg",
    displayUrl: "chicagodog42.com",
  },
  {
    id: "aspiration-bank",
    title: "Aspiration Bank",
    client: "Aspiration Bank",
    location: "National",
    industry: "Online banking",
    period: "2015–2017",
    category: "Websites & brand",
    headlineNumber: "+200% website traffic, year over year",
    hasNumberBadge: true,
    metricValue: "+200%",
    metricLabel: "Website Traffic YoY",
    story:
      "A new values-based bank needed to stand out in a crowded market. We turned loose ideas into one clear brand story and designed and built the website, which drew record traffic and sign-ups after launch.",
    description:
      "A new values-based bank needed to stand out in a crowded market. We turned loose ideas into one clear brand story and designed and built the website.",
    services: ["Brand story", "Web design", "Web development"],
    tags: ["Brand story", "Web design", "Web development"],
    icon: "Landmark",
    bgColor: "#090D16",
    image: "/showcase/aspiration_real_1.png",
    displayUrl: "aspiration.com",
  },
  {
    id: "jacksonville",
    title: "City of Jacksonville",
    client: "City of Jacksonville",
    location: "Duval County, FL",
    industry: "Government",
    category: "Custom software",
    headlineNumber: "Delivered 1 month early · +65% user engagement",
    hasNumberBadge: true,
    metricValue: "+65%",
    metricLabel: "User Engagement",
    story:
      "The county's property appraisal system dated back to 1998. We built a modern replacement that staff could use easily and that connects with other county departments. It led to more work with the city.",
    description:
      "The county's property appraisal system dated back to 1998. We built a modern replacement that staff could use easily and that connects with other county departments.",
    services: ["Custom software", "Systems integration"],
    tags: ["Custom software", "Systems integration", "Civic Portal"],
    icon: "Building2",
    bgColor: "#090D16",
    image: "/showcase/jacksonville_real_1.jpg",
    displayUrl: "coj.net",
  },
  {
    id: "swing-perfect",
    title: "Swing Perfect",
    client: "Swing Perfect",
    location: "National",
    industry: "Golf technology",
    category: "Custom software",
    headlineNumber: "App built in 2 months · Business sold to Golf Galaxy",
    hasNumberBadge: true,
    metricValue: "Acquired",
    metricLabel: "By Golf Galaxy",
    story:
      "A golf-industry founder needed an app nobody had built before. We designed and built it for iPhone and Android in 2 months, then supported sales. The business was later sold to Golf Galaxy.",
    description:
      "A golf-industry founder needed an app nobody had built before. We designed and built it for iPhone and Android in 2 months, then supported sales.",
    services: ["Mobile app", "Business consulting", "Design", "Sales support"],
    tags: ["Mobile app", "Business consulting", "Design"],
    icon: "Trophy",
    bgColor: "#090D16",
    image: "/showcase/swing_perfect_real_1.png",
    displayUrl: "swingperfect.com",
  },
  {
    id: "carmen-hotel",
    title: "Carmen Hotel Collection",
    client: "Carmen Hotel",
    location: "Playa del Carmen, Mexico",
    industry: "Hospitality",
    period: "2017",
    category: "Small business",
    headlineNumber: "6-month social and paid ads program",
    hasNumberBadge: false, // Per copy doc: Robert to confirm; ship the card without a number badge until then
    metricValue: "6-month",
    metricLabel: "Program",
    story:
      "The hotel was struggling with low bookings and guest satisfaction. We ran a 6-month social media and paid ads program on Facebook and Instagram, with video, guest-experience consulting and community management. Paid ads drove site traffic and bookings, and real guest content outperformed branded posts.",
    description:
      "The hotel was struggling with low bookings and guest satisfaction. We ran a 6-month social media and paid ads program on Facebook and Instagram.",
    services: ["Social media", "Paid ads", "Video", "Guest experience"],
    tags: ["Social media", "Paid ads", "Video", "Guest experience"],
    icon: "Hotel",
    bgColor: "#090D16",
    image: "/showcase/carmen_hotel_real_1.jpg",
    displayUrl: "carmenhotel.com",
  },
  {
    id: "turflife",
    title: "TurfLife",
    client: "TurfLife",
    location: "Winter Springs, FL",
    industry: "Lifestyle brand",
    period: "2016–present",
    category: "Websites & brand",
    headlineNumber: "Mentioned nationally across the turf industry",
    hasNumberBadge: true,
    metricValue: "National",
    metricLabel: "Brand Movement",
    story:
      "The founder of Golf Central Magazine wanted a lifestyle brand to take on the biggest names in the category. We built the brand identity, website and social channels behind \"Protect Your Turf\", now recognized by the turf industry nationwide.",
    description:
      "The founder of Golf Central Magazine wanted a lifestyle brand to take on the biggest names in the category. We built the brand identity, website and social channels behind \"Protect Your Turf\".",
    services: ["Brand identity", "Website", "Social media"],
    tags: ["Brand identity", "Website", "Social media"],
    icon: "Trees",
    bgColor: "#090D16",
    image: "/showcase/turflife_real_1.png",
    displayUrl: "turflife.com",
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
