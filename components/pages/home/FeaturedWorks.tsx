"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FeaturedWorksContent } from "@/lib/projects";

import styles from "./FeaturedWorks.module.css";

type FeaturedWorksProps = {
  featuredWorks: FeaturedWorksContent;
};

const WHEEL_SCROLL_MULTIPLIER = 1.2;
const SCROLL_LERP_FACTOR = 0.17;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function FeaturedWorks({ featuredWorks }: FeaturedWorksProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const measureFrameRef = useRef<number | null>(null);
  const targetScrollLeftRef = useRef(0);
  const animatedScrollLeftRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const stopWheelAnimation = useCallback(() => {
    if (wheelFrameRef.current) {
      window.cancelAnimationFrame(wheelFrameRef.current);
      wheelFrameRef.current = null;
    }
  }, []);

  const stopMeasureAnimation = useCallback(() => {
    if (measureFrameRef.current) {
      window.cancelAnimationFrame(measureFrameRef.current);
      measureFrameRef.current = null;
    }
  }, []);

  const getMaxScrollableX = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return 0;
    }

    return Math.max(track.scrollWidth - track.clientWidth, 0);
  }, []);

  const clampScrollX = useCallback(
    (value: number) => clamp(value, 0, getMaxScrollableX()),
    [getMaxScrollableX],
  );

  const syncWheelRefs = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    animatedScrollLeftRef.current = track.scrollLeft;
    targetScrollLeftRef.current = track.scrollLeft;
  }, []);

  const updateActiveFromTrack = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const cards = Array.from(track.children) as HTMLElement[];

    if (cards.length === 0) {
      return;
    }

    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const queueActiveUpdate = useCallback(() => {
    if (measureFrameRef.current) {
      return;
    }

    measureFrameRef.current = window.requestAnimationFrame(() => {
      measureFrameRef.current = null;
      updateActiveFromTrack();
    });
  }, [updateActiveFromTrack]);

  const startWheelAnimation = useCallback(() => {
    if (wheelFrameRef.current) {
      return;
    }

    const step = () => {
      const track = trackRef.current;

      if (!track) {
        wheelFrameRef.current = null;
        return;
      }

      const delta = targetScrollLeftRef.current - animatedScrollLeftRef.current;

      if (Math.abs(delta) < 0.35) {
        animatedScrollLeftRef.current = targetScrollLeftRef.current;
        track.scrollLeft = animatedScrollLeftRef.current;
        wheelFrameRef.current = null;
        return;
      }

      animatedScrollLeftRef.current += delta * SCROLL_LERP_FACTOR;
      track.scrollLeft = animatedScrollLeftRef.current;
      wheelFrameRef.current = window.requestAnimationFrame(step);
    };

    wheelFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  const handleTrackWheel = useCallback(
    (event: WheelEvent) => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (Math.abs(dominantDelta) < 0.25) {
        return;
      }

      const max = getMaxScrollableX();

      if (max <= 0) {
        return;
      }

      const currentX = track.scrollLeft;
      const baseX = wheelFrameRef.current ? targetScrollLeftRef.current : currentX;
      const nextX = clampScrollX(
        baseX + dominantDelta * WHEEL_SCROLL_MULTIPLIER,
      );

      if (Math.abs(nextX - baseX) < 0.25) {
        return;
      }

      event.preventDefault();
      targetScrollLeftRef.current = nextX;

      startWheelAnimation();
    },
    [clampScrollX, getMaxScrollableX, startWheelAnimation],
  );

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }
    syncWheelRefs();
    queueActiveUpdate();

    track.addEventListener("wheel", handleTrackWheel, { passive: false });
    track.addEventListener("scroll", queueActiveUpdate, { passive: true });

    const onResize = () => {
      const clamped = clampScrollX(targetScrollLeftRef.current);
      targetScrollLeftRef.current = clamped;
      animatedScrollLeftRef.current = clamped;

      if (trackRef.current) {
        trackRef.current.scrollLeft = clamped;
      }

      queueActiveUpdate();
    };

    window.addEventListener("resize", onResize);

    return () => {
      track.removeEventListener("wheel", handleTrackWheel);
      track.removeEventListener("scroll", queueActiveUpdate);
      window.removeEventListener("resize", onResize);
      stopWheelAnimation();
      stopMeasureAnimation();
    };
  }, [
    clampScrollX,
    handleTrackWheel,
    queueActiveUpdate,
    stopMeasureAnimation,
    stopWheelAnimation,
    syncWheelRefs,
  ]);

  const activeWork = useMemo(
    () => featuredWorks.items[activeIndex] ?? featuredWorks.items[0],
    [activeIndex, featuredWorks.items],
  );

  return (
    <section className={styles.section} id="works">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{featuredWorks.eyebrow}</p>
          <h2>{featuredWorks.heading}</h2>
          <p className={styles.description}>{featuredWorks.description}</p>
        </header>

        <div className={styles.scroller}>
          <div className={styles.track} ref={trackRef}>
            {featuredWorks.items.map((item, index) => {
              const cardStyle = {
                "--delay": `${index * 120}ms`,
              } as CSSProperties;
              const mediaStyle = {
                backgroundImage: `url(${item.imageUrl})`,
              } as CSSProperties;

              return (
                <Link
                  aria-label={`View project: ${item.title}`}
                  className={styles.card}
                  href={item.href}
                  key={item.slug}
                  style={cardStyle}
                >
                  <div aria-label={item.title} className={styles.media} role="img" style={mediaStyle} />

                  <div className={styles.cardFooter}>
                    <p className={styles.projectLink}>View Project →</p>

                    <div className={styles.metaRow}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.location}</span>
                      <span>{item.year}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {activeWork ? (
          <div className={styles.activeBrief} key={activeWork.slug}>
            <p className={styles.activeBriefMeta}>
              {activeWork.title} | {activeWork.location} | {activeWork.year}
            </p>
            <p className={styles.activeBriefText}>{activeWork.brief}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
