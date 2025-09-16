import React, { useEffect, useState } from "react";
import "./hero-wordmark.css";

export type HeroWordmarkProps = {
  className?: string;
  introComplete?: boolean;
};

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

const HeroWordmark: React.FC<HeroWordmarkProps> = ({ className, introComplete = false }) => {
  const [showWordmark, setShowWordmark] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!introComplete) return;

    if (prefersReducedMotion) {
      setShowWordmark(true);
      setShowTagline(true);
      return;
    }

    // Start wordmark animation immediately when intro completes
    setShowWordmark(true);

    // Show tagline after wordmark settles (800ms delay to match wordmark animation)
    const timer = setTimeout(() => {
      setShowTagline(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [introComplete, prefersReducedMotion]);



  return (
    <div className={`hero-wordmark ${className || ""}`.trim()}>
      <h1 
        className={`hero-wordmark__title ${showWordmark ? 'hero-wordmark__title--visible' : ''}`}
        tabIndex={0}
      >
        SciCo
      </h1>
      <p 
        className={`hero-wordmark__tagline ${showTagline ? 'hero-wordmark__tagline--visible' : ''}`}
        aria-label="Where Obsession Wins"
        tabIndex={0}
      >
        Where Obsession Wins.
      </p>
    </div>
  );
};

export default HeroWordmark;