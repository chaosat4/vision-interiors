"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GalleryContent } from "@/content/gallery/gallery";
import type { GalleryImage } from "@/lib/gallery";

import styles from "./GalleryExperience.module.css";

type GalleryExperienceProps = {
  content: GalleryContent;
  images: GalleryImage[];
};

export default function GalleryExperience({
  content,
  images,
}: GalleryExperienceProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [loadedTiles, setLoadedTiles] = useState<Set<string>>(new Set());

  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const tileRefs = useRef<(HTMLLIElement | null)[]>([]);

  const total = images.length;
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const markLoaded = useCallback((fileName: string) => {
    setLoadedTiles((current) => {
      if (current.has(fileName)) {
        return current;
      }

      const next = new Set(current);
      next.add(fileName);

      return next;
    });
  }, []);

  // Reveal tiles as they scroll into view, so the grid unfolds rather than
  // appearing all at once. Observer callbacks are a subscription, so updating
  // state from here is safe.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const arrived: number[] = [];

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const index = Number(entry.target.getAttribute("data-index"));

          if (Number.isFinite(index)) {
            arrived.push(index);
            observer.unobserve(entry.target);
          }
        }

        if (arrived.length === 0) {
          return;
        }

        setRevealedTiles((current) => {
          const next = new Set(current);
          arrived.forEach((index) => next.add(index));

          return next;
        });
      },
      { rootMargin: "120px 0px", threshold: 0.04 },
    );

    tileRefs.current.forEach((tile) => {
      if (tile) {
        observer.observe(tile);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [total]);

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        if (current === null || total === 0) {
          return current;
        }

        return (current + delta + total) % total;
      });
    },
    [total],
  );

  // Drive the native dialog from state. showModal() gives us a focus trap,
  // Escape-to-close, and an inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    } else if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = () => {
      setActiveIndex(null);
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  // Return focus to the tile that opened the lightbox.
  useEffect(() => {
    if (activeIndex !== null) {
      return;
    }

    const trigger = lastTriggerRef.current;
    lastTriggerRef.current = null;
    trigger?.focus();
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  const handleDialogKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    },
    [step],
  );

  return (
    <div className={styles.page}>
      {/*
        Tile reveal and image fade-in are JS-driven. Without JS neither ever
        resolves, so force the finished state rather than showing an empty grid.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `.${styles.tile}{opacity:1;transform:none;filter:none}.${styles.tileImage}{opacity:1;transform:none}.${styles.tileSkeleton}{display:none}`,
          }}
        />
      </noscript>

      <div aria-hidden className={styles.texture} />

      <header className={styles.topBar}>
        <Link className={styles.back} href="/">
          <span aria-hidden className={styles.backArrow}>
            ←
          </span>
          {content.backLabel}
        </Link>
      </header>

      <header className={styles.header}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.heading}>{content.heading}</h1>
        <p className={styles.description}>{content.description}</p>

        {total > 0 ? (
          <p className={styles.count}>
            {total}{" "}
            {total === 1 ? content.countLabel.singular : content.countLabel.plural}
          </p>
        ) : null}

        <span aria-hidden className={styles.headerRule} />
      </header>

      {total === 0 ? (
        <section className={styles.empty}>
          <h2 className={styles.emptyHeading}>{content.empty.heading}</h2>
          <p className={styles.emptyText}>{content.empty.description}</p>
          <p className={styles.emptyHint}>
            <code>{content.empty.hint}</code>
          </p>
        </section>
      ) : (
        <ul className={styles.grid}>
          {images.map((image, index) => {
            const isLoaded = loadedTiles.has(image.fileName);

            return (
              <li
                className={styles.tile}
                data-index={index}
                data-revealed={revealedTiles.has(index)}
                key={image.fileName}
                ref={(element) => {
                  tileRefs.current[index] = element;
                }}
                style={
                  { "--reveal-delay": `${(index % 6) * 90}ms` } as CSSProperties
                }
              >
                <button
                  aria-label={`${content.lightbox.openLabel}: ${image.alt}`}
                  className={styles.tileButton}
                  data-loaded={isLoaded}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setActiveIndex(index);
                  }}
                  type="button"
                >
                  <span aria-hidden className={styles.tileSkeleton} />

                  <Image
                    alt={image.alt}
                    className={styles.tileImage}
                    fill
                    onLoad={() => {
                      markLoaded(image.fileName);
                    }}
                    priority={index < 4}
                    ref={(element) => {
                      // Cached images can finish before hydration, so onLoad
                      // never fires for them. Catch that on mount.
                      if (element?.complete) {
                        markLoaded(image.fileName);
                      }
                    }}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    src={image.src}
                  />

                  <span aria-hidden className={styles.tileVeil} />
                  <span aria-hidden className={styles.tileCaption}>
                    {image.alt}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <dialog
        aria-label={activeImage?.alt ?? content.lightbox.openLabel}
        className={styles.lightbox}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
      >
        {activeImage ? (
          <div className={styles.lightboxInner}>
            <div className={styles.lightboxBar}>
              <p className={styles.lightboxMeta}>
                <span className={styles.lightboxTitle}>{activeImage.alt}</span>
                <span className={styles.lightboxCount}>
                  {(activeIndex ?? 0) + 1} / {total}
                </span>
              </p>

              <button
                aria-label={content.lightbox.closeLabel}
                className={styles.lightboxClose}
                onClick={close}
                type="button"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            <div className={styles.lightboxStage} key={activeImage.fileName}>
              <Image
                alt={activeImage.alt}
                className={styles.lightboxImage}
                fill
                sizes="100vw"
                src={activeImage.src}
              />
            </div>

            {total > 1 ? (
              <div className={styles.lightboxNav}>
                <button
                  aria-label={content.lightbox.previousLabel}
                  className={styles.lightboxArrow}
                  onClick={() => {
                    step(-1);
                  }}
                  type="button"
                >
                  <span aria-hidden>←</span>
                </button>

                <button
                  aria-label={content.lightbox.nextLabel}
                  className={styles.lightboxArrow}
                  onClick={() => {
                    step(1);
                  }}
                  type="button"
                >
                  <span aria-hidden>→</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
