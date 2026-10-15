export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  external?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
  children?: NavSubItem[];
}

export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  {
    label: "Products",
    href: "/services#products",
    children: [
      { label: "ReLaunch Social Audit", href: "/audit" },
      { label: "ReLaunch AI Recommendations", href: "/ai-recommendations" },
      { label: "ReLaunch Social", href: "/social" },
      { label: "ReLaunch Studio", href: "/studio" },
    ],
  },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const contactInfo = {
  phone: "480-779-9875",
  phoneFormatted: "(480) 779-9875",
  phoneTel: "tel:4807799875",
  email: "care@relaunch.us",
  emailMailto: "mailto:care@relaunch.us",
  location: "Phoenix, Arizona",
  homeBaseDisclaimer: "Based in Phoenix, AZ · Working with clients everywhere",
  established: 2008,
  yearsInBusiness: 18,
};
