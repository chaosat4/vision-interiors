"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { TestimonialsContent } from "@/content/content";

import styles from "./ClientTestimonials.module.css";

const TESTIMONIAL_ROTATION_MS = 3800;

type ClientTestimonialsProps = {
  testimonials: TestimonialsContent;
};

export default function ClientTestimonials({
  testimonials,
}: ClientTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const safeActiveIndex =
    testimonials.items.length > 0
      ? Math.min(activeIndex, testimonials.items.length - 1)
      : 0;

  useEffect(() => {
    if (testimonials.items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        setPreviousIndex(currentIndex);
        return (currentIndex + 1) % testimonials.items.length;
      });
    }, TESTIMONIAL_ROTATION_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [testimonials.items.length]);

  if (testimonials.items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.leftSide}>
            <p className={styles.heading}>{testimonials.heading}</p>

            <div className={styles.leftSlides}>
              {testimonials.items.map((item, index) => {
                const isActive = index === safeActiveIndex;
                const portraitStyle = {
                  backgroundImage: `url(${item.personImageUrl})`,
                } as CSSProperties;

                return (
                  <article
                    className={styles.leftSlide}
                    data-active={isActive}
                    key={item.slug}
                  >
                    <div
                      aria-label={item.personImageAlt}
                      className={styles.clientImage}
                      role="img"
                      style={portraitStyle}
                    />

                    <div className={styles.quoteBlock}>
                      <p>{item.quotePrimary}</p>
                      <p>{item.quoteSecondary}</p>
                    </div>

                    <p className={styles.clientMeta}>
                      {item.clientName}
                      <span>{item.projectName}</span>
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={styles.rightSide}>
            <div className={styles.imageViewport}>
              {testimonials.items.map((item, index) => {
                const imageStyle = {
                  backgroundImage: `url(${item.projectImageUrl})`,
                } as CSSProperties;
                const state =
                  index === safeActiveIndex
                    ? "active"
                    : index === previousIndex
                      ? "previous"
                      : "hidden";

                return (
                  <figure
                    className={styles.projectPanel}
                    data-state={state}
                    key={`project-${item.slug}`}
                  >
                    <div
                      aria-label={item.projectImageAlt}
                      className={styles.projectImage}
                      role="img"
                      style={imageStyle}
                    />
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
