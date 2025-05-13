import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const EventsTable = ({ events, isLoading, error }) => {
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  if (isLoading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return <div className="events-error">Error loading events: {error}</div>;
  }

  if (!events || events.length === 0) {
    return <div className="no-events">No events found.</div>;
  }

  return (
    <div className="events-table-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <table className="events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Category</th>
            <th>Tech Field</th>
            <th>Location</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className={event.status}>
              <td className="event-name">
                {event.eventName || 'Untitled Event'}
              </td>
              <td>{event.category || 'N/A'}</td>
              <td>{(Array.isArray(event.techField) ? event.techField[0] : event.techField) || 'N/A'}</td>
              <td>{event.locationType === 'Online' ? 'Online' : event.city || 'N/A'}</td>
              <td>{event.cost === 'Paid' ? `$${event.amount || '0'}` : 'Free'}</td>
              <td>
                <span className={`status-badge ${event.status || 'pending'}`}>
                  {(event.status || 'pending').charAt(0).toUpperCase() + (event.status || 'pending').slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
