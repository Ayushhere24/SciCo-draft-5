import { useEffect, useMemo, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import "./ball-bounce-intro.css";

export type BallBounceIntroProps = {
  onComplete?: () => void;
};

type Impact = { id: number; x: number; intensity: number };

const LETTERS = ["S", "C", "I", "C", "O"];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const BallBounceIntro: React.FC<BallBounceIntroProps> = ({ onComplete }) => {
  const controls = useAnimationControls();
  const [revealed, setRevealed] = useState(0);
  const [impactEffects, setImpactEffects] = useState<Impact[]>([]);
  const [morphed, setMorphed] = useState(false);

  // Layout constants
  const SLOT = 64; // px
  const GAP = 20; // px
  const STEP = SLOT + GAP; // distance between letter slots

  const stageStyle = useMemo(() => ({ width: STEP * 4 + SLOT }), [STEP, SLOT]);

  const createImpact = (x: number, intensity = 1) => {
    const id = Date.now() + Math.random();
    const impact: Impact = { id, x, intensity: clamp(intensity, 0.2, 2) };
    setImpactEffects((prev) => [...prev, impact]);
    // Remove after 800ms
    window.setTimeout(() => {
      setImpactEffects((prev) => prev.filter((e) => e.id !== id));
    }, 800);
  };

  useEffect(() => {
    let mounted = true;
    // Respect prefers-reduced-motion: skip to end after brief reveal
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = !!m.matches;

    (async () => {
      if (reduced) {
        setRevealed(LETTERS.length);
        // quick subtle enter
        await controls.start({ x: STEP * 4, y: 0 }, { duration: 0.1 });
        window.setTimeout(() => mounted && onComplete?.(), 600);
        return;
      }

      const h0 = 250; // base drop height
      const e = 0.75; // restitution
      const heights = [
        h0 * e * e,
        h0 * Math.pow(e, 4),
        h0 * Math.pow(e, 6),
        h0 * Math.pow(e, 8),
      ];

      // Initial dramatic fall
      await controls.start({
        x: 0,
        y: [-h0 * 1.5, 0],
        transition: {
          y: { type: "spring", stiffness: 600, damping: 25, mass: 1.2 },
        },
      });

      if (!mounted) return;
      createImpact(0, 1.5);
      setRevealed(1);

      // Bounces to reveal C I C O
      for (let i = 0; i < 4; i++) {
        const toX = STEP * (i + 1);
        const h = heights[i];
        const t = 0.8 * Math.sqrt(h / h0);
        await controls.start({
          x: toX,
          y: [0, -h, 0],
          transition: {
            x: { duration: Math.max(0.6, t), ease: [0.25, 0.46, 0.45, 0.94] },
            y: {
              duration: Math.max(0.6, t),
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 400 + i * 100,
              damping: 20 + i * 5,
            },
          },
        });
        if (!mounted) return;
        createImpact(toX, 1 - i * 0.2);
        setRevealed(i + 2);
      }

      // Final micro-settle
      await controls.start({
        y: [0, -8, 0, -4, 0, -2, 0],
        transition: {
          duration: 1.2,
          ease: "easeOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        },
      });
      // Morph ball into the final 'O' ring
      if (mounted) setMorphed(true);

      window.setTimeout(() => mounted && onComplete?.(), 1000);
    })();

    return () => {
      mounted = false;
    };
  }, [STEP, controls, onComplete]);

  return (
    <div className="intro-overlay" role="dialog" aria-label="Loading">
      <div className="intro-overlay__bg" aria-hidden="true" />
      <div className="intro-stage" style={stageStyle}>
        {/* Letters */}
        <div className="intro-letters" style={{ gap: GAP }}>
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              className="intro-letter"
              initial={{ opacity: 0, y: 12, filter: "blur(6px)", scale: 0.86 }}
              animate={{
                // Show letters S, C, I, C progressively; the last 'O' is represented by the ball
                opacity: i < 4 && revealed > i ? 1 : 0,
                y: i < 4 && revealed > i ? 0 : 12,
                filter: i < 4 && revealed > i ? "blur(0px)" : "blur(6px)",
                scale: i < 4 && revealed > i ? 1 : 0.86,
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{
                width: SLOT,
                fontSize: "72px",
                textShadow:
                  i < 4 && revealed > i
                    ? "0 0 10px rgba(34,211,238,0.35), 0 0 20px rgba(34,211,238,0.18), 0 0 40px rgba(217,70,239,0.12)"
                    : "none",
              }}
              aria-hidden="true"
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Ball */}
        <motion.div
          className={"intro-ball" + (morphed ? " intro-ball--o" : "")}
          style={{ position: "absolute", bottom: 0, left: 0, width: SLOT, height: SLOT }}
          animate={controls}
          initial={{ x: 0, y: -400 }}
        >
          <div className="intro-ball__glow" />
          <div className="intro-ball__reflection" />
          {/* Remove black inner fill on final O: only render before morph */}
          {!morphed && <div className="intro-ball__hole" />}
          {/* Reveal a proper glyph 'O' so it visually belongs to SCICO */}
          {morphed && (
            <div className="intro-ball__glyph" aria-hidden="true">O</div>
          )}
        </motion.div>

        {/* Impact effects */}
        {impactEffects.map((effect) => (
          <motion.div
            key={effect.id}
            className="intro-impact"
            style={{ left: effect.x }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="intro-impact__ring" />
            <div className="intro-impact__ring--soft" />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="intro-impact__particle"
                style={{ left: SLOT / 2, top: SLOT / 2 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 30 * effect.intensity,
                  y: Math.sin((i * Math.PI) / 4) * 30 * effect.intensity,
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Loading dots */}
      <div className="intro-dots" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="intro-dot"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />)
        )}
      </div>
    </div>
  );
};

export default BallBounceIntro;
