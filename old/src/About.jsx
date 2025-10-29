import React, { useState } from 'react';

export default function About({ contact, about }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="card profile">
      <div className="profile-pic" aria-hidden>
        {!imgError ? (
          <img
            src="/legacy/ME.png"
            alt={`${contact.name}`}
            className="profile-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="initials">YB</span>
        )}
      </div>
      <h1 className="mono">{contact.name}</h1>
      <p className="muted">{about}</p>
      {/* contact details moved to the Contact section to avoid duplication */}
      <div className="links">
        <a href={`https://${contact.github}`} target="_blank" rel="noreferrer">GitHub</a>
        <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}
