import React, { useEffect, useRef, useState } from 'react';
import './talks-section.css';

interface TalksSectionProps {
  className?: string;
}

const TalksSection: React.FC<TalksSectionProps> = ({ className = '' }) => {
  const slideshowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Podcast images pod1-pod10
  const podcastImages = [
    '/images/pod1.jpg',
    '/images/pod2.jpg',
    '/images/pod3.jpg',
    '/images/pod4.jpg',
    '/images/pod5.jpg',
    '/images/pod6.jpg',
    '/images/pod7.jpg',
    '/images/pod8.jpg',
    '/images/pod9.jpg',
    '/images/pod10.jpg'
  ];

  // Duplicate slides for seamless loop
  const duplicatedImages = [...podcastImages, ...podcastImages];

  useEffect(() => {
    const slideshow = slideshowRef.current;
    if (!slideshow) return;

    let animationId: number;
    let startTime: number;
    const duration = 20000; // 20 seconds per cycle - much slower
    const slideWidth = 400; // Width including gap
    const totalWidth = slideWidth * podcastImages.length;

    const animate = (currentTime: number) => {
      if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const translateX = -(progress * totalWidth);
      
      slideshow.style.transform = `translateX(${translateX}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [podcastImages.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleBeOurGuest = () => {
    // Add functionality for "Be our guest" button
    console.log('Be our guest clicked');
  };

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="talks" 
      className={`talks-section ${className}`}
      aria-label="Talks - Evidence-led conversations"
    >
      <div className="talks-container">
        {/* Header with premium animations */}
        <div className={`talks-header ${isVisible ? 'animate-in' : ''}`}>
          <p className="talks-eyebrow">Signals from the lab.</p>
          <h2 className="talks-heading">
            <span className="talks-title">
              Talks
              <div className="talks-underline"></div>
            </span>
          </h2>
        </div>

        {/* Slideshow */}
        <div className={`talks-slideshow-container ${isVisible ? 'animate-in' : ''}`}>
          <div 
            className="talks-slideshow-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={slideshowRef}
              className="talks-slideshow"
              style={{ width: `${400 * duplicatedImages.length}px` }}
            >
              {duplicatedImages.map((image, index) => (
                <div key={index} className="talks-slide">
                  <img 
                    src={image} 
                    alt={`Podcast episode ${(index % podcastImages.length) + 1}`}
                    className="talks-image"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="384" height="216" xmlns="http://www.w3.org/2000/svg">
                          <rect width="384" height="216" fill="rgba(70,230,230,0.1)" stroke="rgba(70,230,230,0.2)" stroke-width="1" rx="16"/>
                          <text x="192" y="115" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="16">Podcast ${(index % podcastImages.length) + 1}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section with description and button */}
        <div className={`talks-bottom ${isVisible ? 'animate-in' : ''}`}>
          <p className="talks-description">
            Conversations that explore science, curiosity, and ideas shaping the future.
          </p>
          <button 
            className="join-guest-btn"
            onClick={handleBeOurGuest}
            aria-label="Join to be our guest on the podcast"
          >
            Join to be our guest
          </button>
        </div>
      </div>
    </section>
  );
};

export default TalksSection;