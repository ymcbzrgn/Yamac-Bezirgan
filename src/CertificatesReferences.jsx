import React from 'react';
import Section from './Section';

function CertificateBadge({ text }){
  const parts = text.split(' / ');
  return (
    <div className="cert-badge corporate">
      <div className="cert-left">
        <div className="cert-title">{parts[0]}</div>
        {parts[1] && <div className="cert-issuer muted small">{parts[1]}</div>}
      </div>
    </div>
  )
}

function ReferenceCard({ text }){
  const [name, email] = text.split(' — ');
  return (
    <div className="ref-card corporate">
      <div className="ref-avatar" aria-hidden>{name ? name.split(' ').map(n=>n[0]).slice(0,2).join('') : 'R'}</div>
      <div className="ref-body">
        <div className="ref-name mono">{name}</div>
  <div className="muted small">{email}</div>
      </div>
    </div>
  )
}

export default function CertificatesReferences({ certificates, references }) {
  return (
    <>
      <Section title="Certificates">
        <div className="cert-grid">
          {certificates.map(c => (
            <CertificateBadge key={c} text={c} />
          ))}
        </div>
      </Section>

      <Section title="References">
        <div className="refs">
          {references.map(r => <ReferenceCard key={r} text={r} />)}
        </div>
      </Section>
    </>
  );
}
