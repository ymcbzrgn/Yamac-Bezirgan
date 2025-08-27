import React, { useState } from 'react';

export default function Skills({ skills }) {
  const [showAll, setShowAll] = useState(false);
  const displaySkills = showAll ? skills : skills.slice(0, 10);

  return (
    <div id="skills" className="card">
      <h3 className="mono">Skills</h3>
      <div className="chips">
        {displaySkills.map(s => <span key={s} className="chip">{s}</span>)}
      </div>
      {skills.length > 10 && (
        <button 
          className="btn secondary" 
          onClick={() => setShowAll(!showAll)}
          style={{ marginTop: '12px', width: '100%' }}
        >
          {showAll ? 'Show Less' : `Show All (${skills.length})`}
        </button>
      )}
    </div>
  );
}
