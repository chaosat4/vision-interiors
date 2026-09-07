import type { NavigationItem } from "@/content/content";
import { homeContent } from "@/content/content";

export type AboutHeroContent = {
  eyebrow: string;
  heading: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  scrollLabel: string;
};

export type AboutStoryContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  statement: string;
};

export type AboutPageContent = {
  meta: {
    title: string;
    description: string;
  };
  brand: typeof homeContent.brand;
  navigation: NavigationItem[];
  ctaLabel: string;
  hero: AboutHeroContent;
  story: AboutStoryContent;
  team: typeof homeContent.team;
  finalCta: typeof homeContent.finalCta;
  footer: typeof homeContent.footer;
};

export const aboutPageContent: AboutPageContent = {
  meta: {
    title: "About Us | Vision Interiors",
    description:
      "Meet Vision Interiors and discover the thoughtful, collaborative approach behind our architecture and interior design work.",
  },
  brand: homeContent.brand,
  navigation: homeContent.navigation,
  ctaLabel: homeContent.ctaLabel,
  hero: {
    eyebrow: "The Studio",
    heading: "We Design For The Way Life Is Truly Lived",
    description:
      "Vision Interiors is an architecture and interior design studio creating grounded, expressive spaces shaped by people, place, and purpose.",
    imageUrl: "/gallery/2026-01-24-blue-facade-at-dusk.jpg",
    imageAlt: "Contemporary blue facade photographed at dusk.",
    scrollLabel: "Discover Our Story",
  },
  story: {
    eyebrow: "About Vision Interiors",
    heading: "Spaces With Clarity, Warmth, And A Lasting Sense Of Belonging",
    paragraphs: [
      "We believe the most meaningful spaces begin with close observation. Before drawing a line, we listen to how our clients live, work, gather, and imagine the years ahead.",
      "Our studio brings architecture, interiors, material selection, and execution thinking into one connected process. This allows every decision—from the plan to the smallest detail—to serve a shared idea.",
      "The result is never a prescribed style. It is a considered response: calm but characterful, practical without feeling ordinary, and designed to become more personal with time.",
    ],
    imageUrl: "/gallery/2025-11-06-open-plan-living-and-kitchen.jpg",
    imageAlt: "Warm open-plan living room and kitchen interior.",
    imageCaption: "Thoughtful spaces, composed around everyday life.",
    statement: "Good design is not simply seen. It is felt in how naturally a space supports the life within it.",
  },
  team: homeContent.team,
  finalCta: homeContent.finalCta,
  footer: homeContent.footer,
};
