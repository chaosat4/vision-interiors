"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { HomeContent } from "@/content/content";
import SiteNav from "@/components/ui/SiteNav";

import AboutVision from "./AboutVision";
import ArchitecturalCta from "./ArchitecturalCta";
import ClientTestimonials from "./ClientTestimonials";
import FeaturedWorks from "./FeaturedWorks";
import MeetTheTeam from "./MeetTheTeam";
import OurProcess from "./OurProcess";
import SiteFooter from "./SiteFooter";
import styles from "./HomeExperience.module.css";

const SPLASH_STORAGE_KEY = "vision-interiors.splash-seen";
const HERO_VIDEO_START_DELAY = 0;
const HERO_VIDEO_PLAYBACK_RATE = 1;
const HERO_VIDEO_STOP_POINT = 0.5;
const HERO_VIDEO_PAUSE_DURATION = 1400;
const VIDEO_INITIAL_FRAME = 0.04;

/**
 * Module scope survives client-side navigation but resets on a full page load.
 * That is exactly the lifetime we want: the splash plays once when someone
 * arrives, and returning to the home page from /gallery or /contact skips it.
 */
let hasPlayedSplashThisPageLoad = false;
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

  return Math.min(Math.max(13 * 16, viewportWidth * 0.24), 26 * 16);
}

function getSplashHoldHeight(viewportWidth: number): number {
  if (viewportWidth <= 840) {
    return Math.min(Math.max(7.4 * 16, viewportWidth * 0.3), 11 * 16);
  }

  return Math.min(Math.max(7 * 16, viewportWidth * 0.14), 15 * 16);
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
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [splitOffset, setSplitOffset] = useState<{
    left: number;
    right: number;
    up: number;
    down: number;
  }>({
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  });
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const splashVideoRef = useRef<HTMLVideoElement>(null);
  const splashWordTopRef = useRef<HTMLParagraphElement>(null);
  const splashWordBottomRef = useRef<HTMLParagraphElement>(null);
  const smoothScrollFrameRef = useRef<number | null>(null);
  const isHeroReady = phase === "done";

  const stopSmoothScrollFrame = () => {
    if (smoothScrollFrameRef.current) {
      window.cancelAnimationFrame(smoothScrollFrameRef.current);
      smoothScrollFrameRef.current = null;
    }
  };

  const smoothScrollToId = (targetId: string) => {
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;

    if (prefersReducedMotion || Math.abs(targetY - startY) < 4) {
      window.scrollTo(0, targetY);
      return;
    }

    stopSmoothScrollFrame();

    const duration = 900;
    const startAt = performance.now();
    const travel = targetY - startY;
    const easeInOutQuint = (progress: number) =>
      progress < 0.5
        ? 16 * progress ** 5
        : 1 - (-2 * progress + 2) ** 5 / 2;

    const frame = (timestamp: number) => {
      const progress = Math.min((timestamp - startAt) / duration, 1);
      const easedProgress = easeInOutQuint(progress);

      window.scrollTo(0, startY + travel * easedProgress);

      if (progress < 1) {
        smoothScrollFrameRef.current = window.requestAnimationFrame(frame);
        return;
      }

      smoothScrollFrameRef.current = null;
    };

    smoothScrollFrameRef.current = window.requestAnimationFrame(frame);
  };

  const handleScrollCueClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    smoothScrollToId("process");
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      prefersReducedMotion ||
      hasPlayedSplashThisPageLoad ||
      (!IS_DEVELOPMENT && hasSeenSplash())
    ) {
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
    return () => {
      if (smoothScrollFrameRef.current) {
        window.cancelAnimationFrame(smoothScrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") {
      return;
    }

    // Recorded on completion rather than on start, so StrictMode's remount in
    // development does not mark the splash as played before it has run.
    hasPlayedSplashThisPageLoad = true;

    if (!IS_DEVELOPMENT) {
      markSplashAsSeen();
    }
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
      const topHeight = topWord.getBoundingClientRect().height;
      const bottomHeight = bottomWord.getBoundingClientRect().height;
      const holdWindowWidth = getSplashHoldWidth(viewportWidth);
      const holdWindowHeight = getSplashHoldHeight(viewportWidth);
      const safetyGap = Math.max(30, viewportWidth * 0.022);
      const verticalSafetyGap = Math.max(26, window.innerHeight * 0.022);
      const edgeMargin = 12;
      const viewportHeight = window.innerHeight;
      const leftDistance = Math.min(
        topWidth / 2 + holdWindowWidth / 2 + safetyGap,
        Math.max(0, viewportWidth / 2 - topWidth / 2 - edgeMargin),
      );
      const rightDistance = Math.min(
        bottomWidth / 2 + holdWindowWidth / 2 + safetyGap,
        Math.max(0, viewportWidth / 2 - bottomWidth / 2 - edgeMargin),
      );
      const upDistance = Math.min(
        topHeight / 2 + holdWindowHeight / 2 + verticalSafetyGap,
        Math.max(0, viewportHeight / 2 - topHeight / 2 - edgeMargin),
      );
      const downDistance = Math.min(
        bottomHeight / 2 + holdWindowHeight / 2 + verticalSafetyGap,
        Math.max(0, viewportHeight / 2 - bottomHeight / 2 - edgeMargin),
      );

      setSplitOffset({
        left: Math.ceil(leftDistance),
        right: Math.ceil(rightDistance),
        up: Math.ceil(upDistance),
        down: Math.ceil(downDistance),
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

  useEffect(() => {
    if (phase !== "done" || content.hero.headlines.length <= 1) {
      return;
    }

    const rotateTimer = window.setInterval(() => {
      setHeadlineIndex((currentIndex) =>
        (currentIndex + 1) % content.hero.headlines.length,
      );
    }, 15000);

    return () => {
      window.clearInterval(rotateTimer);
    };
  }, [phase, content.hero.headlines.length]);

  const activeHeadline = useMemo(() => {
    if (content.hero.headlines.length === 0) {
      return "";
    }

    return content.hero.headlines[headlineIndex % content.hero.headlines.length];
  }, [content.hero.headlines, headlineIndex]);

  const splashStyle = useMemo(
    () =>
      ({
        "--split-left": `${splitOffset.left}px`,
        "--split-right": `${splitOffset.right}px`,
        "--split-up": `${splitOffset.up}px`,
        "--split-down": `${splitOffset.down}px`,
      }) as CSSProperties,
    [splitOffset.down, splitOffset.left, splitOffset.right, splitOffset.up],
  );

  return (
    <>
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

        <SiteNav
          brand={content.brand}
          ctaLabel={content.ctaLabel}
          navigation={content.navigation}
          revealed={isHeroReady}
        />

        <main className={styles.heroCopy}>
          <h1 className={styles.heroHeadline} key={activeHeadline}>
            {activeHeadline}
          </h1>

          <p className={styles.heroSubheading}>{content.hero.subheading}</p>
        </main>

        <p className={styles.heroDescription}>{content.hero.description}</p>

        <aside aria-label="Studio rating" className={styles.ratingCard}>
          <div className={styles.ratingHeader}>
            <p className={styles.stars} aria-hidden>
              ★★★★☆
            </p>

            <p className={styles.googleBadge}>
              <svg
                aria-hidden
                className={styles.googleIcon}
                viewBox="0 0 24 24"
              >
                <path
                  d="M23.49 12.27c0-.79-.07-1.55-.19-2.27H12v4.29h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.65z"
                  fill="#4285f4"
                />
                <path
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.09A12 12 0 0 0 12 24z"
                  fill="#34a853"
                />
                <path
                  d="M5.28 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.37-2.29V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.38l4.01-3.09z"
                  fill="#fbbc05"
                />
                <path
                  d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4.01 3.09C6.22 6.88 8.87 4.77 12 4.77z"
                  fill="#ea4335"
                />
              </svg>
              Google
            </p>
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.ratingScore}>{content.stat.score}</span>

            <div>
              <p className={styles.ratingLabel}>{content.stat.label}</p>
              <p className={styles.ratingDetail}>{content.stat.detail}</p>
            </div>
          </div>
        </aside>

        <a
          aria-label="Scroll to our process"
          className={styles.scrollCue}
          href="#process"
          onClick={handleScrollCueClick}
        >
          <span className={styles.scrollCueLabel}>Scroll</span>
          <span aria-hidden className={styles.scrollCueIcon}>
            ↓
          </span>
        </a>

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

      <OurProcess process={content.process} />
      <AboutVision about={content.about} />
      <FeaturedWorks featuredWorks={content.featuredWorks} />
      <MeetTheTeam team={content.team} />
      <ClientTestimonials testimonials={content.testimonials} />
      <ArchitecturalCta cta={content.finalCta} />
      <SiteFooter footer={content.footer} />
    </>
  );
}
