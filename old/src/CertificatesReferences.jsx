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

export default function CertificatesReferences({ certificates }) {
  return (
    <Section title="Certificates">
      <div className="cert-grid">
        {certificates.map(c => (
          <CertificateBadge key={c} text={c} />
        ))}
      </div>
    </Section>
  );
}
