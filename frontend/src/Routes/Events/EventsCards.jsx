import { Link } from 'react-router-dom'

const EventsCards = ({ event }) => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    const { _id, name, deadline, startDate, endDate, location, prize, eventLogo, organizerLogo } = event
    
    const handleEventLogoError = (e) => {
      e.target.src = "/images/placeholder.png"
    }

    const handleOrganizerLogoError = (e) => {
      e.target.src = "/images/avatar.png"
    }
  
    return (
      <Link to={`/event/${_id}`} className="events-page-card">
        <div className="events-page-image">
          <img 
            src={eventLogo || "/images/placeholder.png"} 
            alt={name} 
            onError={handleEventLogoError}
          />
        </div>
        <div className="events-page-details">
          <div className="events-page-header">
            <h3 className="events-page-name">{name}</h3>
            <div className="events-page-logo">
              <img src={organizerLogo || "/images/avatar.png"} alt="avatar" onError={handleOrganizerLogoError} />
            </div>
          </div>
          <div className="events-page-info">
            <div className="events-page-info-item">
              <i className="fas fa-bell"></i>
              <span>Deadline: {formatDate(deadline)}</span>
            </div>
            <div className="events-page-info-item">
              <i className="fas fa-calendar"></i>
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div className="events-page-info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{location || "Other"}</span>
            </div>
            <div className="events-page-info-item">
              <i className="fas fa-award"></i>
              <span>{prize || "No prizes "}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }
  
  export default EventsCards
  