"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import type { TeamContent } from "@/content/content";

import styles from "./MeetTheTeam.module.css";

type MeetTheTeamProps = {
  team: TeamContent;
};

export default function MeetTheTeam({ team }: MeetTheTeamProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex =
    team.members.length > 0 ? Math.min(activeIndex, team.members.length - 1) : 0;

  const trackStyle = useMemo(
    () =>
      ({
        transform: `translateY(-${safeActiveIndex * 100}%)`,
      }) as CSSProperties,
    [safeActiveIndex],
  );

  if (team.members.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="team">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2>{team.heading}</h2>
          <p className={styles.description}>{team.description}</p>
        </header>

        <div className={styles.layout}>
          <ul className={styles.memberList}>
            {team.members.map((member, index) => {
              const isActive = index === safeActiveIndex;

              return (
                <li className={styles.memberRow} data-active={isActive} key={member.slug}>
                  <button
                    className={styles.memberButton}
                    onFocus={() => {
                      setActiveIndex(index);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    type="button"
                  >
                    <span className={styles.role}>{member.role}</span>
                    <span className={styles.name}>{member.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.mediaColumn}>
            <div className={styles.imageFrame}>
              <div className={styles.imageTrack} style={trackStyle}>
                {team.members.map((member) => {
                  const panelStyle = {
                    backgroundImage: `url(${member.imageUrl})`,
                  } as CSSProperties;

                  return (
                    <figure className={styles.imagePanel} key={`image-${member.slug}`}>
                      <div
                        aria-label={member.imageAlt}
                        className={styles.image}
                        role="img"
                        style={panelStyle}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
