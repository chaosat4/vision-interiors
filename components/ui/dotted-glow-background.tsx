import type { CSSProperties } from "react";

import styles from "./dotted-glow-background.module.css";

type DottedGlowBackgroundProps = {
  className?: string;
  opacity?: number;
  gap?: number;
  radius?: number;
  colorLightVar?: string;
  glowColorLightVar?: string;
  colorDarkVar?: string;
  glowColorDarkVar?: string;
  backgroundOpacity?: number;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function DottedGlowBackground({
  className,
  opacity = 1,
  gap = 10,
  radius = 1.6,
  colorLightVar = "--color-foreground",
  glowColorLightVar = "--color-foreground",
  colorDarkVar = "--color-foreground",
  glowColorDarkVar = "--color-foreground",
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 1.6,
  speedScale = 1,
}: DottedGlowBackgroundProps) {
  const normalizedSpeed = clamp(((speedMin + speedMax) / 2) * speedScale, 0.1, 6);
  const driftDuration = `${(48 / normalizedSpeed).toFixed(2)}s`;
  const glowDuration = `${(28 / normalizedSpeed).toFixed(2)}s`;

  const style = {
    "--dgb-opacity": `${clamp(opacity, 0, 1)}`,
    "--dgb-gap": `${Math.max(gap, 2)}px`,
    "--dgb-radius": `${Math.max(radius, 0.4)}px`,
    "--dgb-bg-opacity": `${clamp(backgroundOpacity, 0, 1)}`,
    "--dgb-drift-duration": driftDuration,
    "--dgb-glow-duration": glowDuration,
    "--dgb-dot-color": `var(${colorLightVar}, rgb(18 16 13 / 0.18))`,
    "--dgb-glow-color": `var(${glowColorLightVar}, rgb(18 16 13 / 0.3))`,
    "--dgb-dot-color-dark": `var(${colorDarkVar}, rgb(236 230 219 / 0.3))`,
    "--dgb-glow-color-dark": `var(${glowColorDarkVar}, rgb(236 230 219 / 0.42))`,
  } as CSSProperties;

  return (
    <div className={`${styles.root}${className ? ` ${className}` : ""}`} style={style}>
      <div className={styles.base} />
      <div className={styles.pulseDots} />
      <div className={styles.hoverGlow} />
      <div className={styles.hoverPulse} />
      <div className={styles.glowA} />
      <div className={styles.glowB} />
      <div className={styles.glowC} />
    </div>
  );
}
