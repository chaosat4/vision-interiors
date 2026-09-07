import Image from "next/image";
import Link from "next/link";

import SiteNav from "@/components/ui/SiteNav";
import type { NavigationItem } from "@/content/content";
import type { ProjectItem } from "@/lib/projects";

import styles from "./ProjectDetail.module.css";

type ProjectDetailProps = {
  project: ProjectItem;
  nextProject: ProjectItem;
  projectNumber: number;
  brand: {
    topLine: string;
    bottomLine: string;
  };
  navigation: NavigationItem[];
  ctaLabel: string;
};

export default function ProjectDetail({
  project,
  nextProject,
  projectNumber,
  brand,
  navigation,
  ctaLabel,
}: ProjectDetailProps) {
  return (
    <article className={styles.page}>
      <section className={styles.hero} id="top">
        <Image
          alt={project.imageAlt}
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src={project.imageUrl}
        />
        <div aria-hidden className={styles.heroVeil} />

        <div className={styles.navWrap}>
          <SiteNav
            brand={brand}
            brandHref="/"
            ctaLabel={ctaLabel}
            linkBase="/"
            navigation={navigation}
          />
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            {project.categoryLabel} / {String(projectNumber).padStart(2, "0")}
          </p>
          <h1>{project.title}</h1>
          <p className={styles.heroMeta}>
            {project.location} <span>/</span> {project.year}
          </p>
        </div>

        <a className={styles.scrollCue} href="#overview" aria-label="Read project overview">
          <span aria-hidden>↓</span>
        </a>
      </section>

      <section className={styles.overview} id="overview">
        <div className={styles.overviewInner}>
          <p className={styles.sectionIndex}>01 / The Project</p>

          <div className={styles.overviewCopy}>
            <p className={styles.lead}>{project.brief}</p>
            <div className={styles.paragraphs}>
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Category</dt>
              <dd>{project.categoryLabel}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{project.area}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{project.services.join(" / ")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <header className={styles.galleryHeader}>
          <p className={styles.sectionIndex}>02 / Visual Study</p>
          <h2>Material, Light, And Atmosphere</h2>
        </header>

        <div className={styles.galleryGrid}>
          {project.gallery.map((image, index) => (
            <figure className={styles.galleryItem} key={`${image.src}-${index}`}>
              <Image
                alt={image.alt}
                className={styles.galleryImage}
                fill
                sizes="(max-width: 720px) 94vw, (max-width: 1100px) 50vw, 60vw"
                src={image.src}
              />
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Link className={styles.nextProject} href={nextProject.href}>
        <Image
          alt=""
          className={styles.nextImage}
          fill
          sizes="100vw"
          src={nextProject.imageUrl}
        />
        <span aria-hidden className={styles.nextVeil} />
        <span className={styles.nextCopy}>
          <span className={styles.nextLabel}>Next Project</span>
          <span className={styles.nextTitle}>{nextProject.title}</span>
          <span className={styles.nextMeta}>
            {nextProject.categoryLabel} / {nextProject.location}
          </span>
        </span>
        <span aria-hidden className={styles.nextArrow}>→</span>
      </Link>
    </article>
  );
}
