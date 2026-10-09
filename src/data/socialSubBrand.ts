export interface SocialTier {
  id: string;
  name: string;
  price: number;
  track: "Track A (Client Content)" | "Track B (Full Done-For-You)";
  postsPerMonth: string;
  platforms: string[];
  description: string;
  features: string[];
  popular?: boolean;
}

export const socialData = {
  badge: "Autopilot Sub-Brand",
  title: "ReLaunch Social",
  headline: "Your social media runs itself.",
  tagline:
    "Done-for-you social media content created, scheduled, and published across 5 platforms.",
  portalUrl: "https://relaunch-social-orbit.base44.app",
  platforms: ["Instagram", "Facebook", "LinkedIn", "TikTok", "Google Business"],
  stats: [
    { value: 30, suffix: " min", label: "Your monthly time investment" },
    { value: 5, suffix: "", label: "Connected platforms" },
    { value: 6, suffix: "", label: "Flexible tiers" },
    { value: 100, suffix: "%", label: "Automated publishing" },
  ],
  steps: [
    {
      num: "01",
      title: "Subscribe & Get Portal Access",
      description: "Choose your plan and access your client portal in under 60 seconds.",
    },
    {
      num: "02",
      title: "Set Brand Profile & Connect",
      description: "Select your brand archetype, visual style, and connect social accounts.",
    },
    {
      num: "03",
      title: "Approve Monthly Batch",
      description: "We produce your complete monthly content batch. Review and approve in one sitting.",
    },
    {
      num: "04",
      title: "Automated Publishing",
      description: "Posts publish reliably across all 5 platforms with monthly analytics reports.",
    },
  ],
  tiers: [
    {
      id: "track-a-launch",
      name: "Launch (Track A)",
      price: 297,
      track: "Track A (Client Content)",
      postsPerMonth: "12 posts/month",
      platforms: ["Instagram", "Facebook", "Google Business"],
      description: "You supply raw photos/videos; we write captions, design graphics, and schedule.",
      features: [
        "12 formatted posts & captions per month",
        "3 platforms connected",
        "Hashtag & keyword optimization",
        "Metricool automated publishing",
      ],
    },
    {
      id: "track-a-presence",
      name: "Presence (Track A)",
      price: 497,
      track: "Track A (Client Content)",
      postsPerMonth: "20 posts/month",
      platforms: ["Instagram", "Facebook", "LinkedIn", "Google Business"],
      description: "Consistent weekday presence with strategic storytelling and engagement hooks.",
      features: [
        "20 customized posts per month",
        "4 platforms connected",
        "Reel & Story formatting",
        "Monthly performance dashboard",
      ],
      popular: true,
    },
    {
      id: "track-a-velocity",
      name: "Velocity (Track A)",
      price: 797,
      track: "Track A (Client Content)",
      postsPerMonth: "30+ posts/month",
      platforms: ["Instagram", "Facebook", "LinkedIn", "TikTok", "Google Business"],
      description: "Daily high-volume distribution for businesses scaling their local market presence.",
      features: [
        "Daily publishing (30+ posts/mo)",
        "All 5 platforms connected",
        "Custom video thumbnail design",
        "Bi-weekly content strategy updates",
      ],
    },
    {
      id: "track-b-ignite",
      name: "Ignite (Track B)",
      price: 597,
      track: "Track B (Full Done-For-You)",
      postsPerMonth: "12 custom posts/month",
      platforms: ["Instagram", "Facebook", "Google Business"],
      description: "100% hands-off. ReLaunch writes, designs, and animates all brand assets from scratch.",
      features: [
        "Full done-for-you asset creation",
        "Industry-specific educational graphics",
        "Custom branded template library",
        "Monthly review portal with 1-click approvals",
      ],
    },
    {
      id: "track-b-amplify",
      name: "Amplify (Track B)",
      price: 997,
      track: "Track B (Full Done-For-You)",
      postsPerMonth: "20 custom posts + 4 Reels/month",
      platforms: ["Instagram", "Facebook", "LinkedIn", "TikTok", "Google Business"],
      description: "Comprehensive done-for-you package including animated motion graphics and short video.",
      features: [
        "20 posts + 4 short-form video Reels/month",
        "All 5 social platforms",
        "StoryBrand SB7 customer journey narrative",
        "Community comment notification triggers",
      ],
      popular: true,
    },
    {
      id: "track-b-command",
      name: "Command (Track B)",
      price: 1497,
      track: "Track B (Full Done-For-You)",
      postsPerMonth: "Daily posts + 8 video ads/month",
      platforms: ["Instagram", "Facebook", "LinkedIn", "TikTok", "Google Business"],
      description: "Omnipresent market dominance. Daily creative batches, video ads, and priority production.",
      features: [
        "Daily custom creative + 8 video ads/mo",
        "Omni-channel distribution",
        "Social Savannah AI video ad production",
        "Dedicated creative director review",
      ],
    },
  ] as SocialTier[],
};
