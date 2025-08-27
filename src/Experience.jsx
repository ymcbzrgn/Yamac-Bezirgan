import React from 'react';
import Section from './Section';

export default function Experience({ experience }) {
  return (
    <Section title="Experience" id="experience">
      <div className="timeline">
        {experience.map(x => (
          <div className="timeline-item card" key={x.role}>
            <div className="timeline-date muted">{x.date}</div>
            <h4 className="mono">{x.role} <span className="muted small">{x.company ? ` — ${x.company}` : ''}</span></h4>
            <ul>
              {x.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
