import React from "react";

function OrgCard({ organizer }) {
  return (
    <a href={organizer.link} className="orgcard-horizontal-modal">
      <div className="orgcard-horizontal-modal-logo-container">
        <img
          src={organizer.logoUrl || "/images/avatar.png"}
          alt={`${organizer.name} Logo`}
          className="orgcard-horizontal-modal-logo"
        />
      </div>
      <div className="orgcard-horizontal-modal-info">
        <h3 className="orgcard-horizontal-modal-name">{organizer.name}</h3>
        <p className="orgcard-horizontal-modal-events">{organizer.eventCount} Events</p>
        <span className="orgcard-horizontal-modal-link">Explore</span>
      </div>
    </a>
  );
}

export default OrgCard; 