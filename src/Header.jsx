import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ contact, onThemeChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="brand">
        <div style={{fontSize:18,fontWeight:600}}>{contact.name}</div>
      </div>
      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <a href="#about" onClick={toggleMenu}>About</a>
        <a href="#experience" onClick={toggleMenu}>Experience</a>
        <a href="/extra-projects.html" onClick={toggleMenu}>Projects</a>
        <a href="#skills" onClick={toggleMenu}>Skills</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
      </nav>
      <div className="header-right">
        <ThemeSwitcher onThemeChange={onThemeChange} />
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header>
  );
}
