function OrganizerCard({ organizer }) {
    return (
      <a href={organizer.link} className="organizer-card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="organizer-logo-container">
          <img src={organizer.logoUrl || "/images/avatar.png"} alt={`${organizer.name} Logo`} className="organizer-logo" />
        </div>
        <h3 className="organizer-name">{organizer.name}</h3>
        <p className="organizer-events">{organizer.eventCount} Events</p>
        <span className="organizer-link">Explore</span>
      </a>
    )
  }
  
  export default OrganizerCard
  