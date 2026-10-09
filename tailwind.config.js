/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0D9488",
          tealDark: "#0F766E",
          tealDeep: "#115E59",
          tealLight: "#14B8A6",
          tealPale: "#F0FDFA",
          tealMuted: "#CCFBF1",
          orange: "#FF6700",
          orangeBright: "#FF6700",
          orangeLight: "#FB923C",
          orangePale: "#FFF7ED",
          navy: "#090D16",
          navyCard: "#111726",
          navyBorder: "#1E293B",
          slateText: "#64748B",
          darkBg: "#06090F",
          lightBg: "#F8F9FB",
          cardLight: "#FFFFFF",
          purple: "#7F48ED",
          purpleBrand: "#7F48ED",
          purpleLight: "#A78BFA",
          purpleDark: "#6B38D4",
          purpleDeep: "#5424B8",
          purplePale: "#F5F3FF",
          purpleMuted: "rgba(127, 72, 237, 0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-outfit)", "Outfit", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "solid-xs": "2px 2px 0px 0px #090D16",
        "solid-sm": "3px 3px 0px 0px #090D16",
        "solid": "4px 4px 0px 0px #090D16",
        "solid-md": "6px 6px 0px 0px #090D16",
        "solid-lg": "8px 8px 0px 0px #090D16",
        "solid-teal": "4px 4px 0px 0px #0D9488",
        "solid-orange": "4px 4px 0px 0px #FF6700",
        "solid-purple": "4px 4px 0px 0px #7F48ED",
        "solid-white": "4px 4px 0px 0px #FFFFFF",
      },
      borderRadius: {
        "card": "12px",
      }
    },
  },
  plugins: [],
};
