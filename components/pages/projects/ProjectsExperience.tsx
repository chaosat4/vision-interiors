"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import SiteNav from "@/components/ui/SiteNav";
import type { NavigationItem } from "@/content/content";
import type {
  ProjectFilter,
  ProjectItem,
  ProjectsPageContent,
} from "@/lib/projects";

import styles from "./ProjectsExperience.module.css";

type ProjectsExperienceProps = {
  content: ProjectsPageContent;
  projects: ProjectItem[];
  brand: {
    topLine: string;
    bottomLine: string;
  };
  navigation: NavigationItem[];
  ctaLabel: string;
};

export default function ProjectsExperience({
  content,
  projects,
  brand,
  navigation,
  ctaLabel,
}: ProjectsExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");

  const visibleProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter, projects],
  );

  const heroProject = projects[0];

  return (
    <section className={styles.page} id="top">
      <div aria-hidden className={styles.texture} />

      <div className={styles.navWrap}>
        <SiteNav
          brand={brand}
          brandHref="/"
          ctaLabel={ctaLabel}
          linkBase="/"
          navigation={navigation}
        />
      </div>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.heading}</h1>
          <p className={styles.description}>{content.description}</p>
        </div>

        {heroProject ? (
          <div aria-hidden className={styles.heroMedia}>
            <Image
              alt=""
              className={styles.heroImage}
              fill
              priority
              sizes="(max-width: 800px) 88vw, 42vw"
              src={heroProject.imageUrl}
            />
            <span className={styles.heroMediaVeil} />
            <span className={styles.heroNumber}>01</span>
          </div>
        ) : null}

        <p aria-hidden className={styles.ghostWord}>
          Projects
        </p>
      </header>

      <div className={styles.collection}>
        <div className={styles.collectionHeader}>
          <p className={styles.collectionLabel}>{content.collectionLabel}</p>

          <div
            aria-label={content.filtersLabel}
            className={styles.filters}
            role="group"
          >
            {content.filters.map((category) => (
              <button
                aria-pressed={activeFilter === category.slug}
                className={styles.filter}
                data-active={activeFilter === category.slug}
                key={category.slug}
                onClick={() => {
                  setActiveFilter(category.slug);
                }}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>

          <p aria-live="polite" className={styles.resultCount}>
            {String(visibleProjects.length).padStart(2, "0")} Projects
          </p>
        </div>

        {visibleProjects.length > 0 ? (
          <div className={styles.grid} key={activeFilter}>
            {visibleProjects.map((project, index) => (
              <Link
                aria-label={`View ${project.title}`}
                className={styles.card}
                data-layout={project.layout}
                href={project.href}
                key={project.slug}
                style={{ "--card-delay": `${index * 85}ms` } as CSSProperties}
              >
                <Image
                  alt={project.imageAlt}
                  className={styles.cardImage}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 680px) 94vw, (max-width: 1024px) 50vw, 42vw"
                  src={project.imageUrl}
                />
                <span aria-hidden className={styles.cardVeil} />

                <span className={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.cardCopy}>
                  <span className={styles.cardCategory}>{project.categoryLabel}</span>
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className={styles.cardMeta}>
                    {project.location} / {project.year}
                  </span>
                </span>

                <span aria-hidden className={styles.cardArrow}>
                  ↗
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{content.emptyMessage}</p>
        )}
      </div>
    </section>
  );
}
