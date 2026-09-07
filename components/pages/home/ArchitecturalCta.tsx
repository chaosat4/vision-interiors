"use client";

import { useRef } from "react";

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import type { CtaContent } from "@/content/content";

import styles from "./ArchitecturalCta.module.css";

type ArchitecturalCtaProps = {
  cta: CtaContent;
};

export default function ArchitecturalCta({ cta }: ArchitecturalCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const updatePointerVars = (clientX: number, clientY: number) => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    section.style.setProperty("--dgb-mx", `${Math.min(Math.max(x, 0), 100)}%`);
    section.style.setProperty("--dgb-my", `${Math.min(Math.max(y, 0), 100)}%`);
  };

  return (
    <section
      className={styles.section}
      id="contact"
      onMouseEnter={(event) => {
        updatePointerVars(event.clientX, event.clientY);
        sectionRef.current?.style.setProperty("--dgb-hover", "1");
      }}
      onMouseLeave={() => {
        sectionRef.current?.style.setProperty("--dgb-hover", "0");
      }}
      onMouseMove={(event) => {
        updatePointerVars(event.clientX, event.clientY);
      }}
      ref={sectionRef}
    >
      <DottedGlowBackground
        className={styles.dottedGlow}
        opacity={1}
        gap={10}
        radius={2.2}
        colorLightVar="--cta-dot-color"
        glowColorLightVar="--cta-glow-color"
        colorDarkVar="--cta-dot-color-dark"
        glowColorDarkVar="--cta-glow-color-dark"
        backgroundOpacity={0}
        speedMin={0.35}
        speedMax={1.5}
        speedScale={1}
      />

      <div aria-hidden className={styles.gridOverlay} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>{cta.eyebrow}</p>
        <h2>{cta.heading}</h2>
        <p>{cta.description}</p>
        <a className={styles.button} href={cta.href}>
          {cta.label}
        </a>
      </div>
    </section>
  );
}
