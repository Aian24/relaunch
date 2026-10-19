/**
 * Where each product's main button goes.
 *
 * While a product's own site is NOT live, leave `liveUrl` as null: the button opens the
 * strategy-call form with that product pre-selected, using `pendingLabel`.
 * When the site goes live, paste its address into `liveUrl` (e.g. "https://audit.relaunch.us")
 * and the button switches to a link to that site, using `liveLabel`. Nothing else needs to change.
 */
export interface ProductLink {
  liveUrl: string | null;
  liveLabel: string;
  pendingLabel: string;
  formTopic: string; // must match a topic in ContactModal's list
}

export const productLinks = {
  aiRecommendations: {
    liveUrl: null, // planned: "https://recommend.relaunch.us"
    liveLabel: "Get started",
    pendingLabel: "Get started",
    formTopic: "AI Recommendations",
  },
  studio: {
    liveUrl: null, // planned: "https://studio.relaunch.us"
    liveLabel: "Start with ReLaunch Studio",
    pendingLabel: "Start with ReLaunch Studio",
    formTopic: "ReLaunch Studio",
  },
  audit: {
    liveUrl: null, // planned: "https://audit.relaunch.us"
    liveLabel: "Get my free score",
    pendingLabel: "Get my free review",
    formTopic: "Social Audit",
  },
} satisfies Record<string, ProductLink>;
