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

      <div className={styles.mobileAccordion}>
        {process.steps.map((step, index) => {
          const isActive = index === activeIndex;
          const mobileCardStyle = {
            "--process-mobile-image": `url(${step.imageUrl || process.imageUrl})`,
          } as CSSProperties;

          return (
            <article
              className={styles.mobileCard}
              data-active={isActive}
              key={`mobile-${step.slug}`}
              style={mobileCardStyle}
            >
              <button
                className={styles.mobileTrigger}
                onClick={() => {
                  activateStep(index, true);
                }}
                type="button"
              >
                <span className={styles.mobileStep}>{step.label}</span>
                <span className={styles.mobileTitle}>{step.title}</span>
                <span aria-hidden className={styles.mobileIndicator}>
                  {isActive ? "−" : "+"}
                </span>
              </button>

              <div className={styles.mobilePanel}>
                <p className={styles.mobileSummary}>{step.summary}</p>
                <p className={styles.mobileDetail}>{step.detail}</p>
                <p className={styles.mobileMetric}>{step.metric}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
