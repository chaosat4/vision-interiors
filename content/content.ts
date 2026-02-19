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

export type AboutShowcaseImage = {
  slug: string;
  imageUrl: string;
  alt: string;
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  images: AboutShowcaseImage[];
};

export type FeaturedWorkItem = {
  slug: string;
  title: string;
  location: string;
  year: string;
  brief: string;
  imageUrl: string;
  href: string;
};

export type FeaturedWorksContent = {
  eyebrow: string;
  heading: string;
  description: string;
  items: FeaturedWorkItem[];
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
  about: AboutContent;
  featuredWorks: FeaturedWorksContent;
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
  about: {
    eyebrow: "About Vision Interiors",
    heading:
      "The Vision Interiors Architecture Style Is Defined By Strong, Solid Forms With Subtle Elegance, Natural Balance And Enduring Appeal",
    description:
      "We work closely with clients right from the start, with clear communication and expert guidance along the way. We also work closely with builders, consultants, and partners to make sure each project runs smoothly and the final build delivers well beyond shared aspirations.",
    ctaLabel: "Learn More About Us",
    ctaHref: "#contact",
    images: [
      {
        slug: "about-left",
        imageUrl:
          "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1400&q=80",
        alt: "Curved architecture viewed from below.",
      },
      {
        slug: "about-center",
        imageUrl:
          "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1400&q=80",
        alt: "Glass building facade catching warm sunlight.",
      },
      {
        slug: "about-right",
        imageUrl:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
        alt: "Interior courtyard opening framed by architecture.",
      },
    ],
  },
  featuredWorks: {
    eyebrow: "Curated Portfolio",
    heading: "Featured Works",
    description:
      "A selection of residential and hospitality projects where material warmth, spatial clarity, and timeless proportion come together.",
    items: [
      {
        slug: "courtyard-house",
        title: "Courtyard House",
        location: "Banjara Hills",
        year: "2024",
        brief:
          "A contemporary family residence organized around water, daylight, and a quiet internal garden. Warm textures balance the clean architectural shell.",
        imageUrl:
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "stone-villa",
        title: "Stone + Light Villa",
        location: "Jubilee Hills",
        year: "2024",
        brief:
          "A layered home where stone, soft timber tones, and open transitions create calm visual rhythm across public and private zones.",
        imageUrl:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "urban-courtyard",
        title: "Urban Courtyard Residence",
        location: "Emaar District",
        year: "2023",
        brief:
          "Designed for city living with inward-looking landscaped pockets, this project delivers privacy while keeping generous spatial openness.",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "minimal-townhome",
        title: "Minimal Townhome",
        location: "Kokapet",
        year: "2023",
        brief:
          "An edited palette and precise detailing shape a minimal yet warm home, with flexible interiors tuned for everyday family routines.",
        imageUrl:
          "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "hillside-courtyard",
        title: "Hillside Courtyard Home",
        location: "Gachibowli",
        year: "2024",
        brief:
          "Terraced spatial planning responds to the natural slope, combining framed landscape views with intimate and sheltered gathering spaces.",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "terrace-villa",
        title: "Terrace Light Villa",
        location: "Financial District",
        year: "2022",
        brief:
          "Sunlight-first planning guides this villa, where each level opens to outdoor terraces and creates a seamless indoor-outdoor lifestyle.",
        imageUrl:
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "stone-frame-house",
        title: "Stone Frame Residence",
        location: "Tellapur",
        year: "2022",
        brief:
          "Robust stone volumes are softened with curated interiors and textured finishes, delivering durability with understated luxury.",
        imageUrl:
          "https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
      {
        slug: "monolith-house",
        title: "Monolith Family House",
        location: "Narsingi",
        year: "2021",
        brief:
          "A bold monolithic exterior gives way to warm, human-scaled interiors designed for fluid movement, family interaction, and quiet comfort.",
        imageUrl:
          "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1800&q=80",
        href: "#",
      },
    ],
  },
  stat: {
    score: "4.6",
    label: "Excellent",
    detail: "Based on 19 reviews",
  },
};
