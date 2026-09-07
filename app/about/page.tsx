import type { Metadata } from "next";

import AboutExperience from "@/components/pages/about/AboutExperience";
import { aboutPageContent } from "@/content/about/about";

export const metadata: Metadata = {
  title: aboutPageContent.meta.title,
  description: aboutPageContent.meta.description,
};

export default function AboutPage() {
  return <AboutExperience content={aboutPageContent} />;
}
