import React, { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ contact, onThemeChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleThemeChangeAndCloseMenu = (theme) => {
    onThemeChange(theme);
    if (isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="brand">
        <div style={{fontSize:18,fontWeight:600}}>{contact.name}</div>
      </div>
      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <a href="#about" onClick={toggleMenu}>About</a>
        <a href="#experience" onClick={toggleMenu}>Experience</a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
            // Send message to parent OS to open new window
            window.parent.postMessage({
              type: 'OPEN_WINDOW',
              appId: 'browser',
              url: '/legacy/extra-projects.html',
              title: 'All Projects'
            }, '*');
          }}
        >
          Projects
        </a>
        <a href="#skills" onClick={toggleMenu}>Skills</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
        {isMobile && (
          <div className="mobile-theme-switcher">
            <ThemeSwitcher onThemeChange={handleThemeChangeAndCloseMenu} />
          </div>
        )}
      </nav>
      <div className="header-right">
        {!isMobile && <ThemeSwitcher onThemeChange={onThemeChange} />}
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header>
  );
}
