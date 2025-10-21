import React from 'react';
import Section from './Section';

export default function Contact({ contact }) {
  return (
    <Section title="Contact" id="contact">
      <div className="contact-compact corporate">
        <div className="contact-line">
          <div className="contact-icon" aria-hidden>✉️</div>
          <div className="contact-info">
            <div className="contact-value mono"><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
            <div className="muted small">Email</div>
          </div>
        </div>

        <div className="contact-line">
          <div className="contact-icon" aria-hidden>📞</div>
          <div className="contact-info">
            <div className="contact-value mono"><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
            <div className="muted small">Phone</div>
          </div>
        </div>

        <div className="contact-line">
          <div className="contact-icon" aria-hidden>🌐</div>
          <div className="contact-info">
            <div className="contact-value mono">
              <a href={contact.website?.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer">
                {contact.website}
              </a>
            </div>
            <div className="muted small">Website</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
