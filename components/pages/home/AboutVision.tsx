"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { AboutContent } from "@/content/content";

import styles from "./AboutVision.module.css";

type FloatingTimeline = {
  entryStart: number;
  entryEnd: number;
  holdEnd: number;
  exitEnd: number;
  entryX: number;
  entryY: number;
  exitX: number;
  exitY: number;
  rotation: number;
};

type FloatingMotion = {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  blur: number;
};

const CARD_TIMELINES: FloatingTimeline[] = [
  {
    entryStart: 0,
    entryEnd: 0.2,
    holdEnd: 0.38,
    exitEnd: 0.56,
    entryX: -44,
    entryY: 24,
    exitX: -10,
    exitY: -42,
    rotation: -7,
  },
  {
    entryStart: 0.24,
    entryEnd: 0.46,
    holdEnd: 0.66,
    exitEnd: 0.84,
    entryX: 0,
    entryY: 32,
    exitX: 0,
    exitY: -50,
    rotation: 0,
  },
  {
    entryStart: 0.52,
    entryEnd: 0.72,
    holdEnd: 0.9,
    exitEnd: 1,
    entryX: 44,
    entryY: 24,
    exitX: 8,
    exitY: -44,
    rotation: 7,
  },
];

const MOBILE_CARD_TIMELINES: FloatingTimeline[] = [
  {
    entryStart: 0,
    entryEnd: 0.28,
    holdEnd: 1,
    exitEnd: 1,
    entryX: -24,
    entryY: 16,
    exitX: 0,
    exitY: 0,
    rotation: -5,
  },
  {
    entryStart: 0.26,
    entryEnd: 0.54,
    holdEnd: 1,
    exitEnd: 1,
    entryX: 0,
    entryY: 20,
    exitX: 0,
    exitY: 0,
    rotation: 0,
  },
  {
    entryStart: 0.52,
    entryEnd: 0.8,
    holdEnd: 1,
    exitEnd: 1,
    entryX: 24,
    entryY: 16,
    exitX: 0,
    exitY: 0,
    rotation: 5,
  },
];

const POSITION_CLASSES = [styles.leftCard, styles.centerCard, styles.rightCard];

type AboutVisionProps = {
  about: AboutContent;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function normalize(value: number, start: number, end: number): number {
  if (end <= start) {
    return 0;
  }

  return clamp((value - start) / (end - start), 0, 1);
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3;
}

function easeInOutCubic(value: number): number {
  if (value < 0.5) {
    return 4 * value ** 3;
  }

  return 1 - (-2 * value + 2) ** 3 / 2;
}

function getSectionProgress(section: HTMLElement): number {
  const sectionRect = section.getBoundingClientRect();
  const sectionStart = window.scrollY + sectionRect.top;
  const sectionTravel = section.offsetHeight - window.innerHeight;

  if (sectionTravel <= 0) {
    return window.scrollY > sectionStart ? 1 : 0;
  }

  return clamp((window.scrollY - sectionStart) / sectionTravel, 0, 1);
}

function projectFloatingCard(
  progress: number,
  timeline: FloatingTimeline,
): FloatingMotion {
    if (progress <= timeline.entryStart) {
      return {
        x: timeline.entryX,
        y: timeline.entryY,
      opacity: 0,
      scale: 0.88,
      rotation: timeline.rotation,
      blur: 6,
    };
  }

  if (progress < timeline.entryEnd) {
    const enterProgress = easeOutCubic(
      normalize(progress, timeline.entryStart, timeline.entryEnd),
    );

    return {
      x: mix(timeline.entryX, 0, enterProgress),
      y: mix(timeline.entryY, 0, enterProgress),
      opacity: enterProgress,
      scale: mix(0.88, 1, enterProgress),
      rotation: mix(timeline.rotation, 0, enterProgress),
      blur: mix(6, 0, enterProgress),
    };
  }

    if (progress < timeline.holdEnd) {
      const holdProgress = easeInOutCubic(
        normalize(progress, timeline.entryEnd, timeline.holdEnd),
      );

      const holdX = timeline.exitEnd === 1 && timeline.holdEnd === 1 ? 0 : 0.8;
      const holdY = timeline.exitEnd === 1 && timeline.holdEnd === 1 ? 0 : -3.4;
      const holdScale = timeline.exitEnd === 1 && timeline.holdEnd === 1 ? 1 : 1.03;

      return {
        x: mix(0, holdX, holdProgress),
        y: mix(0, holdY, holdProgress),
        opacity: 1,
        scale: mix(1, holdScale, holdProgress),
        rotation: 0,
        blur: 0,
      };
    }

    if (timeline.exitEnd === timeline.holdEnd && timeline.holdEnd === 1) {
      return {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        blur: 0,
      };
    }

  if (progress < timeline.exitEnd) {
    const exitProgress = easeInOutCubic(
      normalize(progress, timeline.holdEnd, timeline.exitEnd),
    );

    return {
      x: mix(0.8, timeline.exitX, exitProgress),
      y: mix(-3.4, timeline.exitY, exitProgress),
      opacity: mix(1, 0, exitProgress),
      scale: mix(1.03, 0.88, exitProgress),
      rotation: mix(0, timeline.rotation * 0.36, exitProgress),
      blur: mix(0, 4.5, exitProgress),
    };
  }

  return {
    x: timeline.exitX,
    y: timeline.exitY,
    opacity: 0,
    scale: 0.88,
    rotation: timeline.rotation * 0.36,
    blur: 4.5,
  };
}

export default function AboutVision({ about }: AboutVisionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateViewportMode = () => {
      setIsCompact(window.innerWidth <= 680);
    };

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);

    return () => {
      window.removeEventListener("resize", updateViewportMode);
    };
  }, []);

  useEffect(() => {
    const runUpdate = () => {
      frameRef.current = null;

      if (!sectionRef.current) {
        return;
      }

      setProgress(getSectionProgress(sectionRef.current));
    };

    const queueUpdate = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(runUpdate);
    };

    queueUpdate();

    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const floatingCards = useMemo(
    () =>
      about.images.slice(0, 3).map((image, index) => {
        const timelineSet = isCompact ? MOBILE_CARD_TIMELINES : CARD_TIMELINES;
        const timeline = timelineSet[index] ?? timelineSet[timelineSet.length - 1];
        const motion = projectFloatingCard(progress, timeline);

        const cardStyle = {
          "--card-x": `${motion.x}vw`,
          "--card-y": `${motion.y}vh`,
          "--card-rotation": `${motion.rotation}deg`,
          "--card-scale": `${motion.scale}`,
          opacity: motion.opacity,
          filter: `blur(${motion.blur}px)`,
        } as CSSProperties;

        const imageStyle = {
          backgroundImage: `url(${image.imageUrl})`,
        } as CSSProperties;

        return {
          slug: image.slug,
          alt: image.alt,
          cardClass: POSITION_CLASSES[index] ?? POSITION_CLASSES[POSITION_CLASSES.length - 1],
          cardStyle,
          imageStyle,
        };
      }),
    [about.images, isCompact, progress],
  );

  return (
    <section className={styles.section} id="about" ref={sectionRef}>
      <div className={styles.stickyStage}>
        <div aria-hidden className={styles.backgroundTexture} />

        <div aria-hidden className={styles.floatingLayer}>
          {floatingCards.map((card) => (
            <figure
              className={`${styles.floatingCard} ${card.cardClass}`}
              key={card.slug}
              style={card.cardStyle}
            >
              <div aria-label={card.alt} className={styles.floatingImage} role="img" style={card.imageStyle} />
            </figure>
          ))}
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{about.eyebrow}</p>
          <h2>{about.heading}</h2>
          <p className={styles.description}>{about.description}</p>

          <a className={styles.cta} href={about.ctaHref}>
            {about.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
