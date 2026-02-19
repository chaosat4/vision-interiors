export type NavigationItem = {
  label: string;
  href: string;
};

export type HeroStat = {
  score: string;
  label: string;
  detail: string;
};

export type HomeContent = {
  brand: {
    topLine: string;
    bottomLine: string;
  };
  navigation: NavigationItem[];
  ctaLabel: string;
  hero: {
    headlines: string[];
    subheading: string;
    description: string;
    videoUrl: string;
    posterUrl: string;
  };
  stat: HeroStat;
};

export const homeContent: HomeContent = {
  brand: {
    topLine: "VISION",
    bottomLine: "INTERIORS",
  },
  navigation: [
    { label: "Studio", href: "#studio" },
    { label: "Works", href: "#works" },
    { label: "Gallery", href: "#gallery" },
    { label: "Process", href: "#process" },
  ],
  ctaLabel: "Contact Us",
  hero: {
    headlines: [
      "Designing Spaces That Shape Life",
      "Where Spaces Become Statements",
      "Building Environments That Inspire",
      "Spaces That Define Experience",
      "Beyond Interiors. Beyond Boundaries.",
      "Where Life and Work Find Balance",
      "Built for Living. Designed for Growth.",
      "Architecture That Feels Personal",
      "Crafted Interiors, Lasting Impact",
      "Design for Living and Work",
    ],
    subheading: "Architecture + Interior Design Studio",
    description:
      "A full service design firm for homes built to express warmth, quiet luxury, and timeless proportion.",
    videoUrl: "/hero-bg.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80",
  },
  stat: {
    score: "4.6",
    label: "Excellent",
    detail: "Based on 19 reviews",
  },
};
