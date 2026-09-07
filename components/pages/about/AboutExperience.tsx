import AboutHero from "@/components/pages/about/AboutHero";
import AboutStory from "@/components/pages/about/AboutStory";
import ArchitecturalCta from "@/components/pages/home/ArchitecturalCta";
import MeetTheTeam from "@/components/pages/home/MeetTheTeam";
import SiteFooter from "@/components/pages/home/SiteFooter";
import type { AboutPageContent } from "@/content/about/about";

type AboutExperienceProps = {
  content: AboutPageContent;
};

export default function AboutExperience({ content }: AboutExperienceProps) {
  return (
    <>
      <main>
        <AboutHero
          brand={content.brand}
          ctaLabel={content.ctaLabel}
          hero={content.hero}
          navigation={content.navigation}
        />
        <AboutStory story={content.story} />
        <MeetTheTeam team={content.team} />
        <ArchitecturalCta cta={content.finalCta} />
      </main>
      <SiteFooter footer={content.footer} linkBase="/" />
    </>
  );
}
