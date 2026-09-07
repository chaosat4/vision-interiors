import type { Metadata } from "next";

import ArchitecturalCta from "@/components/pages/home/ArchitecturalCta";
import SiteFooter from "@/components/pages/home/SiteFooter";
import ProjectsExperience from "@/components/pages/projects/ProjectsExperience";
import { homeContent } from "@/content/content";
import { readProjects, readProjectsSettings } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readProjectsSettings();

  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default async function ProjectsPage() {
  const [projects, content] = await Promise.all([
    readProjects(),
    readProjectsSettings(),
  ]);

  return (
    <>
      <main>
        <ProjectsExperience
          brand={homeContent.brand}
          content={content}
          ctaLabel={homeContent.ctaLabel}
          navigation={homeContent.navigation}
          projects={projects}
        />
        <ArchitecturalCta cta={homeContent.finalCta} />
      </main>
      <SiteFooter footer={homeContent.footer} linkBase="/" />
    </>
  );
}
