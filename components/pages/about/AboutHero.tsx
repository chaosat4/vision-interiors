import Image from "next/image";

import SiteNav from "@/components/ui/SiteNav";
import type { AboutHeroContent } from "@/content/about/about";
import type { NavigationItem } from "@/content/content";

import styles from "./AboutHero.module.css";

type AboutHeroProps = {
  brand: {
    topLine: string;
    bottomLine: string;
  };
  navigation: NavigationItem[];
  ctaLabel: string;
  hero: AboutHeroContent;
};

export default function AboutHero({
  brand,
  navigation,
  ctaLabel,
  hero,
}: AboutHeroProps) {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.media}>
        <Image
          alt={hero.imageAlt}
          className={styles.image}
          fill
          priority
          sizes="100vw"
          src={hero.imageUrl}
        />
      </div>

      <div aria-hidden className={styles.atmosphere} />

      <SiteNav
        brand={brand}
        brandHref="/"
        ctaLabel={ctaLabel}
        linkBase="/"
        navigation={navigation}
      />

      <div className={styles.copy}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1>{hero.heading}</h1>
        <p className={styles.description}>{hero.description}</p>
      </div>

      <a className={styles.scrollCue} href="#story">
        <span>{hero.scrollLabel}</span>
        <span aria-hidden className={styles.scrollArrow}>
          ↓
        </span>
      </a>

      <p aria-hidden className={styles.index}>
        Vision / 01
      </p>
    </section>
  );
}
