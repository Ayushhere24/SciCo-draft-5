import React, { useEffect, useRef } from 'react';
import './podcast-slider.css';

interface PodcastSliderProps {
  className?: string;
}

const PodcastSlider: React.FC<PodcastSliderProps> = ({ className = '' }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Using existing thumbnail images
  const thumbnails = [
    '/images/thumbnail 1.jpg',
    '/images/thumbnail 2.jpg', 
    '/images/thumbnail 3.jpg',
    '/images/thumnail 4.jpg',
    '/images/thumbnail 5.jpg',
    '/images/thumnail 6.jpg'
  ];

  // Duplicate slides for seamless loop
  const duplicatedThumbnails = [...thumbnails, ...thumbnails];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let startTime: number;
    const duration = 5000; // 5 seconds per cycle
    const slideWidth = 320; // Width including gap
    const totalWidth = slideWidth * thumbnails.length;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const translateX = -(progress * totalWidth);
      
      slider.style.transform = `translateX(${translateX}px)`;
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

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [thumbnails.length]);

  return (
    <div className={`podcast-slider-container ${className}`}>
      <div className="podcast-slider-wrapper">
        <div 
          ref={sliderRef}
          className="podcast-slider"
          style={{ width: `${320 * duplicatedThumbnails.length}px` }}
        >
          {duplicatedThumbnails.map((thumb, index) => (
            <div key={index} className="podcast-slide">
              <img 
                src={thumb} 
                alt={`Podcast episode ${(index % thumbnails.length) + 1}`}
                className="podcast-thumbnail"
                onError={(e) => {
                  // Fallback for missing images
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="304" height="171" xmlns="http://www.w3.org/2000/svg">
                      <rect width="304" height="171" fill="rgba(70,230,230,0.1)" stroke="rgba(70,230,230,0.2)" stroke-width="1" rx="22"/>
                      <text x="152" y="90" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="14">Podcast ${(index % thumbnails.length) + 1}</text>
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

export default PodcastSlider;