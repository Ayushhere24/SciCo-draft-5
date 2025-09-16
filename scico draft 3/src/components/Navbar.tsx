import React from "react";
import "./navbar.css";

export type NavbarProps = {
  className?: string;
};

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`navbar ${className || ''}`} role="banner" aria-label="Primary navigation">
      <nav className="navbar__pill" aria-label="Primary">
        <ul className="navbar__menu">
          <li>
            <a 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, 'home')}
              className="navbar__link"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="navbar__link"
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#explorations" 
              onClick={(e) => handleSmoothScroll(e, 'explorations')}
              className="navbar__link"
            >
              Explorations
            </a>
          </li>
          <li>
            <a 
              href="#talks" 
              onClick={(e) => handleSmoothScroll(e, 'talks')}
              className="navbar__link"
            >
              Talks
            </a>
          </li>
          <li>
            <a 
              href="#collaboration" 
              onClick={(e) => handleSmoothScroll(e, 'collaboration')}
              className="navbar__link"
            >
              Collaboration
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
