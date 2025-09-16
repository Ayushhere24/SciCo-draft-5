import React, { useEffect, useMemo, useRef, useState } from "react";
import "./home-section.css";
import HeroWordmark from "./HeroWordmark";
import InteractiveBackground from "./InteractiveBackground";

export type HomeSectionProps = {
  images?: string[];
  video?: string;
  /**
   * Total time (ms) for a full rotation cycle. Defaults to 7000ms.
   */
  rotationDurationMs?: number;
  /**
   * Radius of the circular track in px. Component is responsive; this is a base that adapts.
   */
  baseRadiusPx?: number;
  /**
   * Whether the intro animation has completed
   */
  introComplete?: boolean;
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  images = DEFAULT_IMAGES,
  video,
  rotationDurationMs = 7000,
  baseRadiusPx = 260,
  introComplete = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [angle, setAngle] = useState(0); // Current rotation angle in radians
  const [loadedCount, setLoadedCount] = useState(0);

  // Responsive radius based on container width
  const radius = useMemo(() => {
    const width = containerRef.current?.clientWidth ?? 800;
    const clamped = Math.max(140, Math.min(width * 0.28, baseRadiusPx));
    return clamped;
  }, [baseRadiusPx, containerRef.current?.clientWidth]);

  const items = images.slice(0, 4); // ensure max 4 as requested
  const count = Math.max(1, Math.min(4, items.length));

  const allImagesLoaded = loadedCount >= count;

  useEffect(() => {
    if (prefersReducedMotion || !allImagesLoaded) {
      // Do not animate if user prefers reduced motion or images not ready
      return;
    }

    const step = (ts: number) => {
      if (startTimeRef.current == null) {
        startTimeRef.current = ts;
      }
      const elapsed = ts - startTimeRef.current;
      const progress = (elapsed % rotationDurationMs) / rotationDurationMs;
      const nextAngle = progress * Math.PI * 2; // 0 → 2π
      setAngle(nextAngle);
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    };
  }, [rotationDurationMs, prefersReducedMotion, allImagesLoaded]);

  // Video hero mode
  if (video) {
    return (
      <section className="scico-home scico-home--video">
        <div className="hero-video-background">
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="DNA animation showcasing SciCo's scientific focus"
          />
        </div>
        <div className="hero-video-overlay"></div>
        <InteractiveBackground />
        <div className="scico-home__inner">
          <HeroWordmark introComplete={introComplete} />
        </div>
      </section>
    );
  }

  // Single-image hero mode (non-animated)
  if (items.length === 1) {
    return (
      <section className="scico-home">
        <InteractiveBackground />
        <div className="scico-home__inner">
          <HeroWordmark introComplete={introComplete} />
          <div className="hero" aria-label="Featured image">
            <div className={"hero-figure" + (!allImagesLoaded ? " hero-figure--loading" : "")} role="img" aria-label="SciCo home hero image" aria-busy={!allImagesLoaded}>
              <img
                src={items[0]}
                alt="SciCo home hero image centered on the page"
                loading="eager"
                onLoad={() => setLoadedCount(1)}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (prefersReducedMotion) {
    // 2x2 grid fallback; highlight the first image
    return (
      <section className="scico-home">
        <InteractiveBackground />
        <div className="scico-home__inner">
          <HeroWordmark introComplete={introComplete} />
          <div className="grid-fallback" aria-label="Featured topics">
            {items.map((src, i) => (
              <div key={i} className={"grid-item" + (i === 0 ? " front" : "")}> 
                <img src={src} alt="SciCo feature" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 3D Carousel rendering
  return (
    <section className="scico-home">
      <InteractiveBackground />
      <div className="scico-home__inner">
        <HeroWordmark introComplete={introComplete} />

        <div className="carousel" ref={containerRef} aria-label="Rotating featured topics" aria-busy={!allImagesLoaded} data-ready={allImagesLoaded ? "true" : "false"}>
          {items.map((src, index) => {
            const itemAngle = (index / count) * Math.PI * 2 + angle;
            const x = Math.sin(itemAngle) * radius;
            const z = Math.cos(itemAngle) * radius; // positive z is farther away

            // Depth normalization for styling (front when z is minimal/most negative)
            const zNormalized = (z + radius) / (2 * radius); // 0 (front) → 1 (back)
            const isFront = z < 0 && Math.abs(z) > radius * 0.6; // heuristic

            const scale = isFront ? 1.1 : 0.85 + 0.15 * (1 - (z + radius) / (2 * radius));
            const opacity = isFront ? 1 : 0.45 + 0.25 * (1 - zNormalized);
            const blur = isFront ? 0 : 1.5 * zNormalized; // px

            const style: React.CSSProperties = {
              transform: `translate3d(${x}px, 0px, ${-z}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              zIndex: Math.round(1000 - z),
            };

            return (
              <div key={index} className={"carousel-item" + (isFront ? " front" : "") } style={style}>
                <img
                  src={src}
                  alt="SciCo feature"
                  style={{ transform: `scale(${scale})` }}
                  loading="eager"
                  onLoad={() => setLoadedCount((n) => Math.min(count, n + 1))}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeSection;


