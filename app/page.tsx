import HomeExperience from "@/components/pages/home/HomeExperience";
import { homeContent } from "@/content/content";
import {
  createFeaturedWorksContent,
  readProjects,
  readProjectsSettings,
} from "@/lib/projects";

export default async function Home() {
  const [projects, projectSettings] = await Promise.all([
    readProjects(),
    readProjectsSettings(),
  ]);

  return (
    <HomeExperience
      content={{
        ...homeContent,
        featuredWorks: createFeaturedWorksContent(projects, projectSettings),
      }}
    />
  );
}
