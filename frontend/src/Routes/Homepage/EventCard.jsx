import { Link } from "react-router-dom";

function EventCard({ event }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Link to={`/event/${event._id}`} className="homepage-event-card">
      <div className="homepage-event-image-container">
        <img
          src={event.image || "/images/placeholder.png"}
          alt={event.title}
          className="homepage-event-image"
        />
        <div className="homepage-event-image-overlay"></div>
        <div className="homepage-event-logo-container">
          <img
            src={event.logo || "/images/avatar.png"}
            alt="Organizer Logo"
            className="homepage-event-logo"
          />
        </div>
      </div>
      <div className="homepage-event-header">
        <h3 className="homepage-event-title">{event.title}</h3>
        <div className="homepage-header-divider"></div>
      </div>
      <div className="homepage-event-details">
        <div className="homepage-event-detail">
          <i className="fas fa-bell"></i>
          <span>Registration Deadline: {formatDate(event.deadline)}</span>
        </div>
        <div className="homepage-event-detail">
          <i className="fas fa-calendar"></i>
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>
        <div className="homepage-event-detail">
          <i className="fas fa-map-marker-alt"></i>
          <span>{event.location}</span>
        </div>
        <div className="homepage-event-detail">
          <i className="fas fa-award"></i>
          <span>{event.prize || "No prizes specified"}</span>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
