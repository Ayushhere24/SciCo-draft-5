import React, { useEffect, useRef } from 'react';
import './brand-scroller.css';

interface BrandScrollerProps {
  className?: string;
}

const BrandScroller: React.FC<BrandScrollerProps> = ({ className = '' }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Using existing images as brand placeholders
  const brandLogos = [
    '/images/1.png',
    '/images/2.png',
    '/images/brands.png',
    '/images/1.png',
    '/images/2.png',
    '/images/brands.png',
    '/images/1.png',
    '/images/2.png'
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationId: number;
    let startTime: number;
    const duration = 8000; // 8 seconds per cycle
    const logoWidth = 180; // Width including gap
    const totalWidth = logoWidth * brandLogos.length;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const translateX = -(progress * totalWidth);
      
      scroller.style.transform = `translateX(${translateX}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      startTime = performance.now() - ((performance.now() - startTime) % duration);
      animationId = requestAnimationFrame(animate);
    };

    scroller.addEventListener('mouseenter', handleMouseEnter);
    scroller.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scroller.removeEventListener('mouseenter', handleMouseEnter);
      scroller.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [brandLogos.length]);

  return (
    <div className={`brand-scroller-container ${className}`}>
      <div className="brand-scroller-wrapper">
        <div 
          ref={scrollerRef}
          className="brand-scroller"
          style={{ width: `${180 * duplicatedLogos.length}px` }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="brand-logo-item">
              <img 
                src={logo} 
                alt={`Brand partner ${(index % brandLogos.length) + 1}`}
                className="brand-logo"
                onError={(e) => {
                  // Fallback for missing images
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="164" height="80" xmlns="http://www.w3.org/2000/svg">
                      <rect width="164" height="80" fill="rgba(70,230,230,0.05)" stroke="rgba(70,230,230,0.2)" stroke-width="1" rx="12"/>
                      <text x="82" y="45" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="12">Brand ${(index % brandLogos.length) + 1}</text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandScroller;