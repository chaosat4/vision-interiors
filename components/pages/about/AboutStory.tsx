import Image from "next/image";

import type { AboutStoryContent } from "@/content/about/about";

import styles from "./AboutStory.module.css";

type AboutStoryProps = {
  story: AboutStoryContent;
};

export default function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className={styles.section} id="story">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{story.eyebrow}</p>
          <h2>{story.heading}</h2>

          <div className={styles.body}>
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <figure className={styles.figure}>
          <div className={styles.imageFrame}>
            <Image
              alt={story.imageAlt}
              className={styles.image}
              fill
              sizes="(max-width: 840px) 92vw, 48vw"
              src={story.imageUrl}
            />
            <span aria-hidden className={styles.imageWash} />
          </div>
          <figcaption>{story.imageCaption}</figcaption>
        </figure>

        <blockquote className={styles.statement}>{story.statement}</blockquote>
      </div>
    </section>
  );
}
