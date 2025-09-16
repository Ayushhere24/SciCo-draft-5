import React, { useEffect, useRef, useState } from 'react';
import './collaboration-section.css';

interface CollaborationSectionProps {
  className?: string;
}

const CollaborationSection: React.FC<CollaborationSectionProps> = ({ className = '' }) => {
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Brand images - separate for each track
  const brand1Image = '/images/brand 1.png';
  const brand2Image = '/images/brand 2.png';

  // Duplicate single images for seamless loop
  const duplicatedBrand1 = Array(6).fill(brand1Image);
  const duplicatedBrand2 = Array(6).fill(brand2Image);

  useEffect(() => {
    const leftTrack = leftTrackRef.current;
    const rightTrack = rightTrackRef.current;
    if (!leftTrack || !rightTrack) return;

    let leftAnimationId: number;
    let rightAnimationId: number;
    let startTime: number;
    const duration = 15000; // 15 seconds per cycle
    const slideWidth = 400; // Width including gap
    const totalWidth = slideWidth * 3; // 3 duplicates

    const animateLeft = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const translateX = -(progress * totalWidth);
      
      leftTrack.style.transform = `translateX(${translateX}px)`;
      leftAnimationId = requestAnimationFrame(animateLeft);
    };

    const animateRight = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = (elapsed % duration) / duration;
      const translateX = progress * totalWidth;
      
      rightTrack.style.transform = `translateX(${translateX}px)`;
      rightAnimationId = requestAnimationFrame(animateRight);
    };

    leftAnimationId = requestAnimationFrame(animateLeft);
    rightAnimationId = requestAnimationFrame(animateRight);

    return () => {
      cancelAnimationFrame(leftAnimationId);
      cancelAnimationFrame(rightAnimationId);
    };
  }, []);

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

  const handleCollaborate = () => {
    console.log('Collaborate with us clicked');
  };

  return (
    <section 
      ref={sectionRef}
      id="collaboration" 
      className={`collaboration-section ${className}`}
      aria-label="Collaboration with leading brands"
    >
      <div className="collaboration-container">
        {/* Header */}
        <div className={`collaboration-header ${isVisible ? 'animate-in' : ''}`}>
          <h2 className="collaboration-heading">Collaboration</h2>
        </div>

        {/* Dual sliding tracks at top */}
        <div className={`collaboration-slides ${isVisible ? 'animate-in' : ''}`}>
          {/* Brand 1 track - moving left */}
          <div className="collaboration-track">
            <div 
              ref={leftTrackRef}
              className="collaboration-slider left-slider"
              style={{ width: `${400 * duplicatedBrand1.length}px` }}
            >
              {duplicatedBrand1.map((image, index) => (
                <div key={`brand1-${index}`} className="collaboration-slide">
                  <img 
                    src={image} 
                    alt="Brand 1 collaboration"
                    className="collaboration-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="350" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="350" height="100" fill="rgba(70,230,230,0.1)" stroke="rgba(70,230,230,0.2)" stroke-width="1" rx="12"/>
                          <text x="175" y="55" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="14">Brand 1</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Brand 2 track - moving right */}
          <div className="collaboration-track">
            <div 
              ref={rightTrackRef}
              className="collaboration-slider right-slider"
              style={{ width: `${400 * duplicatedBrand2.length}px` }}
            >
              {duplicatedBrand2.map((image, index) => (
                <div key={`brand2-${index}`} className="collaboration-slide">
                  <img 
                    src={image} 
                    alt="Brand 2 collaboration"
                    className="collaboration-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="350" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="350" height="100" fill="rgba(70,230,230,0.1)" stroke="rgba(70,230,230,0.2)" stroke-width="1" rx="12"/>
                          <text x="175" y="55" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="14">Brand 2</text>
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
        <div className={`collaboration-bottom ${isVisible ? 'animate-in' : ''}`}>
          <div className="collaboration-description">
            <p>
              We collaborate with leading brands around the world to share the SciCo mindset of curiosity, craft, and constructive action. Together we turn healthy obsession into everyday habits through innovative products, content, and experiences. Our partners help weave science into daily life so people make clearer choices, build smarter routines, and see better results. It is practical change at street level, ideas you can use today for a life that keeps getting better.
            </p>
          </div>
          
          <div className="collaboration-button-container">
            <button 
              className="collaborate-btn"
              onClick={handleCollaborate}
              aria-label="Collaborate with us"
            >
              Collaborate with us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;