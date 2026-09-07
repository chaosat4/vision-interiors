"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { NavigationItem } from "@/content/content";

import styles from "./SiteNav.module.css";

type SiteNavProps = {
  brand: {
    topLine: string;
    bottomLine: string;
  };
  navigation: NavigationItem[];
  ctaLabel: string;
  /**
   * Prefix applied to in-page hash links. Empty on the home page, "/" on any
   * other route so "#works" resolves back to the home page section.
   */
  linkBase?: string;
  brandHref?: string;
  ctaHref?: string;
  /**
   * Drives the staged blur-lift entrance. The home page holds this false until
   * the splash sequence finishes; other routes render revealed immediately.
   */
  revealed?: boolean;
};

export default function SiteNav({
  brand,
  navigation,
  ctaLabel,
  linkBase = "",
  brandHref = "#top",
  ctaHref = "/contact",
  revealed = true,
}: SiteNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only in-page hash links need the base prefix. Route links like "/gallery"
  // are already absolute — prefixing them would produce "//gallery", which the
  // browser reads as a protocol-relative URL.
  const resolveHref = (href: string) =>
    href.startsWith("#") ? `${linkBase}${href}` : href;

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 840) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);

    return () => {
      window.removeEventListener("resize", closeMenuOnDesktop);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={styles.navbar} data-revealed={revealed}>
        <Link className={styles.brandMark} href={brandHref} onClick={closeMobileMenu}>
          <Image
            alt="Vision Interiors logo"
            className={styles.brandLogo}
            height={155}
            priority
            src="/vision-logo.png"
            width={172}
          />

          <span className={styles.brandText}>
            <span>{brand.topLine}</span>
            <span>{brand.bottomLine}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={styles.navLinks}>
          {navigation.map((item) => (
            <Link
              href={resolveHref(item.href)}
              key={item.label}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.navActions}>
          <Link
            className={styles.contactButton}
            href={ctaHref}
            onClick={closeMobileMenu}
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>

          <button
            aria-controls="mobile-primary-nav"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className={styles.menuButton}
            data-open={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen((currentState) => !currentState);
            }}
            type="button"
          >
            <span className={styles.menuButtonLine} />
            <span className={styles.menuButtonLine} />
            <span className={styles.menuButtonLine} />
          </button>
        </div>
      </header>

      <div className={styles.mobileMenu} data-open={isMobileMenuOpen}>
        <nav
          aria-label="Mobile primary"
          className={styles.mobileMenuPanel}
          id="mobile-primary-nav"
        >
          {navigation.map((item) => (
            <Link
              href={resolveHref(item.href)}
              key={`mobile-${item.label}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}

          <Link
            className={styles.mobileContactButton}
            href={ctaHref}
            onClick={closeMobileMenu}
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
