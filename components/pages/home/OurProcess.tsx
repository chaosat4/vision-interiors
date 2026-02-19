"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ProcessContent } from "@/content/content";

import styles from "./OurProcess.module.css";

const COLLAPSED_TRACK = "minmax(0, 0.85fr)";
const EXPANDED_TRACK = "minmax(0, 3.7fr)";

type OurProcessProps = {
  process: ProcessContent;
};

export default function OurProcess({ process }: OurProcessProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimerRef = useRef<number | null>(null);
  const safeActiveIndex =
    process.steps.length > 0
      ? Math.min(activeIndex, process.steps.length - 1)
      : 0;
  const activeStep = process.steps[safeActiveIndex];
  const nextStepIndex =
    process.steps.length > 0
      ? (safeActiveIndex + 1) % process.steps.length
      : 0;

  const activateStep = (nextIndex: number, immediate = false) => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }

    if (immediate) {
      setActiveIndex(nextIndex);
      return;
    }

    hoverTimerRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
    }, 110);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const sectionStyle = useMemo(
    () =>
      ({
        "--process-image": `url(${process.imageUrl})`,
      }) as CSSProperties,
    [process.imageUrl],
  );

  const trackStyle = useMemo(
    () =>
      ({
        gridTemplateColumns: process.steps
          .map((_, index) =>
            index === activeIndex ? EXPANDED_TRACK : COLLAPSED_TRACK,
          )
          .join(" "),
      }) as CSSProperties,
    [activeIndex, process.steps],
  );

  const activeMediaStyle = useMemo(
    () =>
      ({
        "--process-mobile-active-image": `url(${activeStep?.imageUrl || process.imageUrl})`,
      }) as CSSProperties,
    [activeStep?.imageUrl, process.imageUrl],
  );

  if (!activeStep) {
    return (
      <section className={styles.section} id="process" style={sectionStyle}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{process.eyebrow}</p>
          <h2>{process.heading}</h2>
          <p className={styles.description}>{process.description}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="process" style={sectionStyle}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{process.eyebrow}</p>
        <h2>{process.heading}</h2>
        <p className={styles.description}>{process.description}</p>
      </div>

      <div className={styles.track} style={trackStyle}>
        {process.steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <article className={styles.card} data-active={isActive} key={step.slug}>
              <button
                className={styles.cardButton}
                onClick={() => {
                  activateStep(index, true);
                }}
                onFocus={() => {
                  activateStep(index, true);
                }}
                onMouseEnter={() => {
                  activateStep(index);
                }}
                type="button"
              >
                <div className={styles.compactContent}>
                  <span className={styles.compactStep}>{step.label}</span>
                  <span className={styles.compactTitle}>{step.title}</span>
                </div>

                <div className={styles.expandedContent}>
                  <p className={styles.expandedStep}>{step.label}</p>
                  <h3>{step.title}</h3>
                  <p className={styles.summary}>{step.summary}</p>
                  <p className={styles.detail}>{step.detail}</p>
                  <p className={styles.metric}>{step.metric}</p>
                </div>
              </button>

              {isActive && index < process.steps.length - 1 ? (
                <button
                  aria-label={`Go to ${process.steps[index + 1].title}`}
                  className={`${styles.navArrow} ${styles.navArrowRight}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    activateStep(index + 1, true);
                  }}
                  onMouseEnter={() => {
                    activateStep(index + 1);
                  }}
                  type="button"
                >
                  <span aria-hidden className={styles.navArrowGlyph}>
                    →
                  </span>
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className={styles.mobileExperience}>
        <article className={styles.mobileFeaturedCard} key={`featured-${activeStep.slug}`}>
          <div className={styles.mobileFeaturedMedia} style={activeMediaStyle}>
            <span className={styles.mobileFeaturedStep}>{activeStep.label}</span>
            <p className={styles.mobileFeaturedMetric}>{activeStep.metric}</p>
            <h3>{activeStep.title}</h3>

            <button
              aria-label={`Go to ${process.steps[nextStepIndex].title}`}
              className={styles.mobileNextButton}
              onClick={() => {
                activateStep(nextStepIndex, true);
              }}
              type="button"
            >
              <span aria-hidden>↓</span>
            </button>
          </div>

          <div className={styles.mobileFeaturedBody}>
            <p className={styles.mobileFeaturedSummary}>{activeStep.summary}</p>
            <p className={styles.mobileFeaturedDetail}>{activeStep.detail}</p>
          </div>
        </article>

        <ol className={styles.mobileTimeline}>
          {process.steps.map((step, index) => {
            const isActive = index === activeIndex;
            const timelineHint = `${step.summary.split(",")[0].replace(/\.$/, "")}.`;

            return (
              <li
                className={styles.mobileTimelineItem}
                data-active={isActive}
                key={`timeline-${step.slug}`}
              >
                <button
                  className={styles.mobileTimelineButton}
                  onClick={() => {
                    activateStep(index, true);
                  }}
                  type="button"
                >
                  <span className={styles.mobileTimelineDot}>{step.label}</span>

                  <span className={styles.mobileTimelineText}>
                    <span className={styles.mobileTimelineTitle}>{step.title}</span>
                    <span className={styles.mobileTimelineHint}>{timelineHint}</span>
                  </span>

                  <span aria-hidden className={styles.mobileTimelineAction}>
                    {isActive ? "−" : "+"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
