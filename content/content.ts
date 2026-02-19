export type NavigationItem = {
  label: string;
  href: string;
};

export type HeroStat = {
  score: string;
  label: string;
  detail: string;
};

export type ProcessStep = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  detail: string;
  metric: string;
  imageUrl: string;
};

export type ProcessContent = {
  eyebrow: string;
  heading: string;
  description: string;
  imageUrl: string;
  steps: ProcessStep[];
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
  process: ProcessContent;
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
  process: {
    eyebrow: "Our Process",
    heading: "A Clear Path From Vision to Final Space",
    description:
      "Every project moves through a focused sequence to keep creativity, execution, and budget aligned from first conversation to final styling.",
    imageUrl:
      "https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=2200&q=80",
    steps: [
      {
        slug: "discovery",
        label: "01",
        title: "Discovery + Brief",
        summary: "We map your lifestyle, practical needs, and aesthetic direction.",
        detail:
          "Through conversations, site context, and mood references, we define what the space must do and how it should feel.",
        metric: "Week 1",
        imageUrl:
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      },
      {
        slug: "concept",
        label: "02",
        title: "Concept Direction",
        summary: "A curated narrative with palette, materials, and spatial tone.",
        detail:
          "We create concept boards and early visual studies so every design decision follows one cohesive story.",
        metric: "2-3 Concepts",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      },
      {
        slug: "planning",
        label: "03",
        title: "Spatial Planning",
        summary: "Plans are optimized for movement, light, function, and proportion.",
        detail:
          "Layouts are refined across key zones with furniture zoning and circulation to ensure comfort in daily use.",
        metric: "Detailed Layouts",
        imageUrl:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
      },
      {
        slug: "specification",
        label: "04",
        title: "Materials + Styling",
        summary: "Finishes, fixtures, and custom details are selected with intent.",
        detail:
          "We specify textures, colors, and products that balance durability, craft quality, and timeless character.",
        metric: "Curated Selections",
        imageUrl:
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80",
      },
      {
        slug: "delivery",
        label: "05",
        title: "Execution Oversight",
        summary: "Design intent is protected through site coordination and final handover.",
        detail:
          "From vendor collaboration to finishing touches, we guide implementation so the delivered space matches the concept.",
        metric: "End-to-End Support",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      },
    ],
  },
  stat: {
    score: "4.6",
    label: "Excellent",
    detail: "Based on 19 reviews",
  },
};
