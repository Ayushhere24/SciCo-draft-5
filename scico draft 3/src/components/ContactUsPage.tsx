import React from 'react';
import './contact-us-page.css';
import PodcastSlider from './PodcastSlider';
import BrandScroller from './BrandScroller';

interface ContactUsPageProps {
  className?: string;
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ className = '' }) => {
  const handleContactClick = () => {
    // Add contact functionality here (e.g., open modal, navigate to form, etc.)
    console.log('Contact Us clicked');
  };

  return (
    <section 
      id="contact" 
      className={`contact-us-page ${className}`}
      aria-label="Contact Us"
    >
      <div className="contact-us-container">
        {/* Podcast Section - Top to Mid */}
        <div className="podcast-section">
          <h2 className="section-heading">Podcast</h2>
          <PodcastSlider />
          <div className="podcast-cta">
            <p className="cta-text">Want to be our guest in podcast?</p>
            <button 
              className="contact-button"
              onClick={handleContactClick}
              aria-label="Contact us to be a podcast guest"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Brands Section - Mid to Bottom */}
        <div className="brands-section">
          <h2 className="section-heading">Brands we have worked with</h2>
          <BrandScroller />
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;