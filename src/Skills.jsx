import React from 'react';

export default function Skills({ skills }) {
  return (
    <div id="skills" className="card">
      <h3 className="mono">Skills</h3>
      <div className="chips">
        {skills.map(s => <span key={s} className="chip">{s}</span>)}
      </div>
    </div>
  );
}
