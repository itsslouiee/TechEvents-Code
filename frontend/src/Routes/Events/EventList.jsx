"use client"

import { useRef } from "react"
import EventsCards from "./EventsCards"

const EventList = ({ events }) => {
  // Reference to the event list container for scrolling
  const eventListRef = useRef(null)

  // Function to group events into pairs for two cards per row
  const groupEventsInPairs = (events) => {
    if (!events || !Array.isArray(events)) {
      return []
    }
    const pairs = []
    for (let i = 0; i < events.length; i += 2) {
      pairs.push(events.slice(i, i + 2))
    }
    return pairs
  }

  const eventPairs = groupEventsInPairs(events)

  return (
    <div className="events-page-list" ref={eventListRef}>
      {!events || events.length === 0 ? (
        <div className="events-page-no-events">
          <p>No events found matching your criteria.</p>
        </div>
      ) : (
        eventPairs.map((pair, index) => (
          <div key={index} className="events-page-row">
            {pair.map((event) => (
              <EventsCards key={event._id || event.name} event={event} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}

export default EventList
