"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { HomeContent } from "@/content/content";

import styles from "./HomeExperience.module.css";

const SPLASH_STORAGE_KEY = "vision-interiors.splash-seen";
const HERO_VIDEO_START_DELAY = 0;
const HERO_VIDEO_PLAYBACK_RATE = 1;
const HERO_VIDEO_STOP_POINT = 0.5;
const HERO_VIDEO_PAUSE_DURATION = 1400;
const VIDEO_INITIAL_FRAME = 0.04;
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

type SplashPhase = "intro" | "split" | "hold" | "burst" | "done";

const SPLASH_SEQUENCE: Array<{ phase: SplashPhase; at: number }> = [
  { phase: "split", at: 900 },
  { phase: "hold", at: 2050 },
  { phase: "burst", at: 3000 },
  { phase: "done", at: 3560 },
];

type HomeExperienceProps = {
  content: HomeContent;
};

function getSplashHoldWidth(viewportWidth: number): number {
  if (viewportWidth <= 840) {
    return Math.min(Math.max(13 * 16, viewportWidth * 0.58), 22 * 16);
  }

  return Math.min(Math.max(15 * 16, viewportWidth * 0.31), 29 * 16);
}

function hasSeenSplash(): boolean {
  try {
    return window.localStorage.getItem(SPLASH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSplashAsSeen() {
  try {
    window.localStorage.setItem(SPLASH_STORAGE_KEY, "1");
  } catch {
    return;
  }
}

export default function HomeExperience({ content }: HomeExperienceProps) {
  const [phase, setPhase] = useState<SplashPhase>("intro");
  const [splitOffset, setSplitOffset] = useState<{ left: number; right: number }>(
    {
      left: 0,
      right: 0,
    },
  );
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const splashVideoRef = useRef<HTMLVideoElement>(null);
  const splashWordTopRef = useRef<HTMLParagraphElement>(null);
  const splashWordBottomRef = useRef<HTMLParagraphElement>(null);
  const isHeroReady = phase === "done";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || (!IS_DEVELOPMENT && hasSeenSplash())) {
      const skipTimer = window.setTimeout(() => {
        setPhase("done");

        if (!IS_DEVELOPMENT) {
          markSplashAsSeen();
        }
      }, 0);

      return () => {
        window.clearTimeout(skipTimer);
      };
    }

    const timers = SPLASH_SEQUENCE.map(({ phase: nextPhase, at }) =>
      window.setTimeout(() => {
        setPhase(nextPhase);

        if (nextPhase === "done" && !IS_DEVELOPMENT) {
          markSplashAsSeen();
        }
      }, at),
    );

    return () => {
      timers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  useEffect(() => {
    if (phase !== "done" || IS_DEVELOPMENT) {
      return;
    }

    markSplashAsSeen();
  }, [phase]);

  useEffect(() => {
    const primeVideoFrame = (video: HTMLVideoElement | null) => {
      if (!video) {
        return () => undefined;
      }

      const setInitialFrame = () => {
        const hasDuration = Number.isFinite(video.duration) && video.duration > 0;

        video.pause();

        try {
          video.currentTime = hasDuration ? Math.min(VIDEO_INITIAL_FRAME, video.duration) : 0;
        } catch {
          return;
        }
      };

      if (video.readyState >= 1) {
        setInitialFrame();
      } else {
        video.addEventListener("loadedmetadata", setInitialFrame, { once: true });
      }

      return () => {
        video.removeEventListener("loadedmetadata", setInitialFrame);
      };
    };

    const cleanups = [
      primeVideoFrame(heroVideoRef.current),
      primeVideoFrame(splashVideoRef.current),
    ];

    return () => {
      cleanups.forEach((cleanup) => {
        cleanup();
      });
    };
  }, [content.hero.videoUrl]);

  useEffect(() => {
    let frameId = 0;

    const updateSplitDistance = () => {
      const topWord = splashWordTopRef.current;
      const bottomWord = splashWordBottomRef.current;

      if (!topWord || !bottomWord) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const topWidth = topWord.getBoundingClientRect().width;
      const bottomWidth = bottomWord.getBoundingClientRect().width;
      const holdWindowWidth = getSplashHoldWidth(viewportWidth);
      const safetyGap = Math.max(30, viewportWidth * 0.022);
      const leftDistance = topWidth / 2 + holdWindowWidth / 2 + safetyGap;
      const rightDistance = bottomWidth / 2 + holdWindowWidth / 2 + safetyGap;

      setSplitOffset({
        left: Math.ceil(leftDistance),
        right: Math.ceil(rightDistance),
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateSplitDistance);
    };

    scheduleUpdate();

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        scheduleUpdate();
      });
    }

    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, [content.brand.topLine, content.brand.bottomLine]);

  useEffect(() => {
    if (phase !== "done") {
      return;
    }

    const heroVideo = heroVideoRef.current;
    const splashVideo = splashVideoRef.current;

    if (!heroVideo) {
      return;
    }

    let metadataHandler: (() => void) | null = null;
    let monitorFrame = 0;
    let pauseFrame = 0;

    const clearAnimationFrames = () => {
      window.cancelAnimationFrame(monitorFrame);
      window.cancelAnimationFrame(pauseFrame);
    };

    const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

    const beginSlowPause = () => {
      window.cancelAnimationFrame(monitorFrame);

      const startRate = heroVideo.playbackRate;
      const startAt = performance.now();

      const step = (now: number) => {
        const progress = Math.min(
          (now - startAt) / HERO_VIDEO_PAUSE_DURATION,
          1,
        );

        const easedProgress = easeOutCubic(progress);
        const targetRate = startRate + (0.08 - startRate) * easedProgress;

        heroVideo.playbackRate = Math.max(0.08, targetRate);

        if (progress < 1) {
          pauseFrame = window.requestAnimationFrame(step);
          return;
        }

        heroVideo.pause();
        heroVideo.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
      };

      pauseFrame = window.requestAnimationFrame(step);
    };

    const monitorPlaybackProgress = () => {
      if (Number.isFinite(heroVideo.duration) && heroVideo.duration > 0) {
        const stopTime = heroVideo.duration * HERO_VIDEO_STOP_POINT;

        if (heroVideo.currentTime >= stopTime) {
          beginSlowPause();
          return;
        }
      }

      monitorFrame = window.requestAnimationFrame(monitorPlaybackProgress);
    };

    const startHeroVideo = () => {
      const synchronizedStartTime = splashVideo
        ? splashVideo.currentTime
        : VIDEO_INITIAL_FRAME;

      heroVideo.currentTime = Math.max(VIDEO_INITIAL_FRAME, synchronizedStartTime);
      heroVideo.playbackRate = HERO_VIDEO_PLAYBACK_RATE;

      const playResult = heroVideo.play();

      if (playResult) {
        playResult.catch(() => undefined);
      }

      monitorFrame = window.requestAnimationFrame(monitorPlaybackProgress);
    };

    const startWhenReady = () => {
      if (heroVideo.readyState >= 2) {
        startHeroVideo();
        return;
      }

      metadataHandler = () => {
        startHeroVideo();
      };

      heroVideo.addEventListener("loadeddata", metadataHandler, {
        once: true,
      });
    };

    const startDelayId = window.setTimeout(startWhenReady, HERO_VIDEO_START_DELAY);

    return () => {
      window.clearTimeout(startDelayId);
      clearAnimationFrames();

      if (metadataHandler) {
        heroVideo.removeEventListener("loadeddata", metadataHandler);
      }
    };
  }, [phase]);

  const headingLines = useMemo(
    () => content.hero.heading.split("\n"),
    [content.hero.heading],
  );

  const splashStyle = useMemo(
    () =>
      ({
        "--split-left": `${splitOffset.left}px`,
        "--split-right": `${splitOffset.right}px`,
      }) as CSSProperties,
    [splitOffset.left, splitOffset.right],
  );

  return (
    <section className={styles.page} data-ready={isHeroReady} id="top">
      <div aria-hidden className={styles.heroMedia}>
        <video
          className={styles.heroVideo}
          muted
          preload="metadata"
          playsInline
          ref={heroVideoRef}
        >
          <source src={content.hero.videoUrl} type="video/mp4" />
        </video>
      </div>

      <div aria-hidden className={styles.heroAtmosphere} />

      <header className={styles.navbar}>
        <a className={styles.brandMark} href="#top">
          <span>{content.brand.topLine}</span>
          <span>{content.brand.bottomLine}</span>
        </a>

        <nav aria-label="Primary" className={styles.navLinks}>
          {content.navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className={styles.contactButton} href="#contact">
          {content.ctaLabel}
          <span aria-hidden>→</span>
        </a>
      </header>

      <main className={styles.heroCopy}>
        <h1>
          {headingLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>

        <p className={styles.heroSubheading}>{content.hero.subheading}</p>
      </main>

      <p className={styles.heroDescription}>{content.hero.description}</p>

      <aside aria-label="Studio rating" className={styles.ratingCard}>
        <p className={styles.stars} aria-hidden>
          ★★★★★
        </p>

        <div className={styles.ratingRow}>
          <span className={styles.ratingScore}>{content.stat.score}</span>

          <div>
            <p className={styles.ratingLabel}>{content.stat.label}</p>
            <p className={styles.ratingDetail}>{content.stat.detail}</p>
          </div>
        </div>
      </aside>

      <div
        aria-hidden
        className={styles.splash}
        data-phase={phase}
        style={splashStyle}
      >
        <div className={styles.splashBackdrop} />

        <div className={styles.splashWindow}>
          <video
            className={styles.splashVideo}
            muted
            playsInline
            preload="auto"
            ref={splashVideoRef}
          >
            <source src={content.hero.videoUrl} type="video/mp4" />
          </video>
        </div>

        <p className={styles.splashWordTop} ref={splashWordTopRef}>
          {content.brand.topLine}
        </p>

        <p className={styles.splashWordBottom} ref={splashWordBottomRef}>
          {content.brand.bottomLine}
        </p>
      </div>
    </section>
  );
}
