import React, { useEffect, useRef, useState } from "react";
import "./interactive-background.css";

export type InteractiveBackgroundProps = {
  className?: string;
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
}

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

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const createParticles = () => {
      const particleCount = Math.min(50, Math.floor((width * height) / 25000));
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          connections: []
        });
      }
    };

    const updateParticles = () => {
      if (prefersReducedMotion) return;

      particlesRef.current.forEach(particle => {
        // Mouse influence (very subtle)
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.002;
          particle.vx += dx * force;
          particle.vy += dy * force;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Damping
        particle.vx *= 0.999;
        particle.vy *= 0.999;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections first
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.15;
            
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(34, 211, 238, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(126, 142, 245, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(217, 70, 239, ${opacity * 0.6})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particlesRef.current.forEach(particle => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(34, 211, 238, ${particle.opacity})`);
        gradient.addColorStop(0.7, `rgba(126, 142, 245, ${particle.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(217, 70, 239, ${particle.opacity * 0.3})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      if (!isVisible) return;
      
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Initialize
    resizeCanvas();
    createParticles();
    
    if (!prefersReducedMotion) {
      animate();
    } else {
      // Static fallback - just draw once
      drawParticles();
    }

    // Event listeners
    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={`interactive-background ${className || ""}`.trim()}
      aria-hidden="true"
    />
  );
};

export default InteractiveBackground;