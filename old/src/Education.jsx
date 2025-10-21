import React, { useState } from 'react';

function Excerpt({ text = '', open }){
  if(!text) return null;
  // only render when explicitly open
  if(open) return <div className="edu-details open">{text}</div>;
  return null;
}

export default function Education({ education }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="card">
      <h3 className="mono">Education</h3>
      <div className="edu-list">
        {education.map((e, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={`${e.school}-${i}`} className="edu-row">
              <div className="edu-left">
                <div className="edu-school"><strong>{e.school}</strong></div>
                <div className="muted small edu-degree">{e.degree}</div>
                <Excerpt text={e.details} open={isOpen} />
                {e.details && (
                  <button
                    className="toggle-details"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Hide details' : 'Show details'}
                  </button>
                )}
              </div>
              <div className="edu-right muted small">{e.date}</div>
            </div>
          );
        })}
      </div>
  {/* edit note removed per UX request */}
    </div>
  );
}
