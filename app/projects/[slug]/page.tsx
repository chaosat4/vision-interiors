import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArchitecturalCta from "@/components/pages/home/ArchitecturalCta";
import SiteFooter from "@/components/pages/home/SiteFooter";
import ProjectDetail from "@/components/pages/projects/ProjectDetail";
import { homeContent } from "@/content/content";
import { readProjects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await readProjects();

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await readProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | Vision Interiors`,
    description: project.brief,
    openGraph: {
      title: `${project.title} | Vision Interiors`,
      description: project.brief,
      images: [{ url: project.imageUrl, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = await readProjects();
  const projectIndex = projects.findIndex((item) => item.slug === slug);

  if (projectIndex < 0) {
    notFound();
  }

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <>
      <main>
        <ProjectDetail
          brand={homeContent.brand}
          ctaLabel={homeContent.ctaLabel}
          navigation={homeContent.navigation}
          nextProject={nextProject}
          project={project}
          projectNumber={projectIndex + 1}
        />
        <ArchitecturalCta cta={homeContent.finalCta} />
      </main>
      <SiteFooter footer={homeContent.footer} linkBase="/" />
    </>
  );
}
