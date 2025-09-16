import React, { useMemo } from "react";
import "./podcast.css";

export type PodcastItem = { id: string; hook: string };
export type PodcastSectionProps = {
  items?: PodcastItem[];
  title?: string;
};

const PODCASTS: PodcastItem[] = [
  { id: "<YOUTUBE_ID_1>", hook: "Obsession is a system, not a mood." },
  { id: "<YOUTUBE_ID_2>", hook: "Curiosity beats talent—every day." },
  { id: "<YOUTUBE_ID_3>", hook: "Science turns chaos into progress." },
  { id: "<YOUTUBE_ID_4>", hook: "Better is built, not found." },
  { id: "<YOUTUBE_ID_5>", hook: "Innovation starts with questions." },
  { id: "<YOUTUBE_ID_6>", hook: "Failure is data in disguise." },
];

const PodcastSection: React.FC<PodcastSectionProps> = ({
  items,
  title = "Podcasts",
}) => {
  const data = useMemo(() => items || PODCASTS, [items]);
  
  // Duplicate the data for seamless looping
  const duplicatedData = useMemo(() => [...data, ...data], [data]);

  return (
    <section id="podcasts" className="podcasts" aria-label="Podcasts">
      <div className="podcasts__inner">
        <header className="podcasts__header">
          <p className="podcasts__eyebrow">Signals from the lab.</p>
          <h2 className="podcasts__title">{title}</h2>
        </header>

        <div className="podcasts__scroll-container">
          <div className="podcasts__scroll-track">
            {duplicatedData.map((p, i) => {
              const href = `https://www.youtube.com/watch?v=${p.id}`;
              const thumb = `https://img.youtube.com/vi/${p.id}/hqdefault.jpg`;
              return (
                <article key={`${p.id}-${i}`} className="pod-tile">
                  <a
                    className="pod-tile__link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Play podcast: ${p.hook}`}
                  >
                    <div className="pod-tile__image">
                      <img src={thumb} alt="Podcast thumbnail" loading="lazy" />
                      <div className="pod-tile__overlay">
                        <span className="pod-tile__play" aria-hidden="true">
                          <span className="pod-tile__play-triangle" />
                        </span>
                      </div>
                    </div>
                    <div className="pod-tile__content">
                      <p className="pod-tile__hook">{p.hook}</p>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
