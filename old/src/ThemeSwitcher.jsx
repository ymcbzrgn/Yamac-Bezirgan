import React, { useEffect, useState } from 'react';

const themes = [
  { name: 'Light', id: 'light' },
  { name: 'Dark', id: 'dark' },
  { name: 'Paper', id: 'paper' },
];

export default function ThemeSwitcher({ onThemeChange }) {
  const [active, setActive] = useState(() => document.body.getAttribute('data-theme') || 'light');

  useEffect(() => {
    // keep local active state in sync if another part of the app changes the body theme
    const observer = new MutationObserver(() => setActive(document.body.getAttribute('data-theme') || 'light'));
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const handle = (id) => {
    setActive(id);
    onThemeChange && onThemeChange(id);
  };

  return (
    <div className="theme-switcher" role="tablist" aria-label="Theme switcher">
      {themes.map(t => (
        <button
          key={t.id}
          className={`ts-btn ${active === t.id ? 'active' : ''}`}
          onClick={() => handle(t.id)}
          aria-pressed={active === t.id}
          title={t.name}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
