import React from 'react';
import Section from './Section';

export default function Projects({ projects }) {
  return (
    <Section title="Projects" id="projects">
      <div className="projects-grid">
        {projects.map(p => (
          <div key={p.name} className="project-card">
            <div className="project-body">
              <h4 className="mono">{p.name}</h4>
              <div className="muted small" style={{marginTop:6}}>{p.tech}</div>
              <p style={{marginTop:8,fontSize:14,color:'#444'}}>{p.summary}</p>
              <div style={{marginTop:12}}>
                <a className="btn" href="#" onClick={(e)=>e.preventDefault()}>Details</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
