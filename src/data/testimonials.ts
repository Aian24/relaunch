export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  highlight: string;
  metric: string;
  metricLabel: string;
  serviceUsed: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: "quinnlan-realty",
    name: "Jerry Q.",
    role: "Managing Principal",
    company: "QuinnLan Realty Group",
    quote:
      "Bobby and his team didn't just build a pretty site — they engineered it to close commercial deals. Within 60 days of launching the new platform, our qualified inbound buyer inquiries jumped 340%, leading directly to two closed transactions.",
    rating: 5,
    highlight: "+340% qualified buyer inquiries in 60 days",
    metric: "+340%",
    metricLabel: "Inbound Leads",
    serviceUsed: "Web Platform & Lead Capture",
  },
  {
    id: "phoenix-limo",
    name: "Paschal F.",
    role: "Operations Director",
    company: "Phoenix Limo Services",
    quote:
      "Before ReLaunch, our website looked fine but barely converted traffic into reservations. Their redesigned booking engine and automated follow-up funnels drove a 4.2x increase in direct reservations in our first quarter, drastically reducing our dependency on third-party aggregators.",
    rating: 5,
    highlight: "4.2x increase in direct reservations",
    metric: "4.2x",
    metricLabel: "Direct Bookings",
    serviceUsed: "Web & Automated Booking Pipeline",
  },
  {
    id: "acme-rewards",
    name: "Cameron L.",
    role: "Founder & CEO",
    company: "ACME Rewards Club",
    quote:
      "ReLaunch rebuilt our member onboarding funnel and customer CRM workflows. Our conversion rate from paid traffic jumped from 3.2% to 11.4%, adding over $85,000 in new recurring membership revenue in the first 90 days.",
    rating: 5,
    highlight: "+$85,000 new revenue in first 90 days",
    metric: "+$85K",
    metricLabel: "New ARR Added",
    serviceUsed: "Custom Software & Growth Engine",
  },
];
