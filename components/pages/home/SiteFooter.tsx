import type { CSSProperties } from "react";

import type { FooterContent } from "@/content/content";

import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  footer: FooterContent;
};

export default function SiteFooter({ footer }: SiteFooterProps) {
  const imageStyle = {
    backgroundImage: `url(${footer.imageUrl})`,
  } as CSSProperties;

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.inner}>
        <div className={styles.topGrid}>
          <figure className={styles.mediaFrame}>
            <div
              aria-label={footer.imageAlt}
              className={styles.media}
              role="img"
              style={imageStyle}
            />
          </figure>

          <nav className={styles.navigation}>
            <p className={styles.heading}>{footer.navigationHeading}</p>
            <div className={styles.navLinks}>
              {footer.navigationLinks.map((link) => (
                <a href={link.href} key={`footer-nav-${link.label}`}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <section className={styles.info}>
            <p className={styles.heading}>{footer.infoHeading}</p>
            <div className={styles.infoLines}>
              {footer.infoLines.map((line) => (
                <p key={`footer-info-${line}`}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.bottomRow}>
          <p>{footer.copyright}</p>
          <p>{footer.statusText}</p>

          <div className={styles.legalLinks}>
            {footer.legalLinks.map((link) => (
              <a href={link.href} key={`footer-legal-${link.label}`}>
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.socialLinks}>
            {footer.socialLinks.map((link) => (
              <a href={link.href} key={`footer-social-${link.label}`}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
