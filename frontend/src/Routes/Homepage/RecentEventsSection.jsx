"use client"

import { useState, useRef, useEffect } from "react"
import EventCard from "./EventCard"
import { getLatestEvents } from "../../api/eventApi"

function RecentEventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getLatestEvents()
        console.log('Latest Events Data:', data)
        setEvents(data)
        setMaxIndex(data.length - 1)
      } catch (err) {
        console.error('Error fetching latest events:', err)
        setError("Failed to load latest events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const scrollNext = () => {
    if (currentIndex < 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = (containerRef.current.scrollWidth / 2) * currentIndex
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  if (loading) {
    return (
      <section className="section recent-events">
        <div className="wave-top"></div>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Latest Events</h2>
            <p className="section-description">Check out the newest tech events you won't want to miss!</p>
          </div>
          <div className="loading">Loading...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section recent-events">
        <div className="wave-top"></div>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Latest Events</h2>
            <p className="section-description">Check out the newest tech events you won't want to miss!</p>
          </div>
          <div className="error">{error}</div>
        </div>
      </section>
    )
  }

  if (!events || events.length === 0) {
    return (
      <section className="section recent-events">
        <div className="wave-top"></div>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Latest Events</h2>
            <p className="section-description">Check out the newest tech events you won't want to miss!</p>
          </div>
          <div className="no-data">No events available at the moment</div>
        </div>
      </section>
    )
  }

  return (
    <section className="section recent-events">
      <div className="wave-top"></div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Latest Events</h2>
          <p className="section-description">Check out the newest tech events you won't want to miss!</p>
        </div>

        <div className="events-container" ref={containerRef}>
          {events.map((event) => (
            <EventCard 
              key={event._id} 
              event={{
                id: event._id,
                title: event.name,
                deadline: event.deadline,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                prize: event.prize,
                image: event.eventLogo,
                logo: event.organizerLogo,
                category: event.category
              }} 
            />
          ))}
        </div>

        <div className="controls-container">
          <div className="controls-center">
            <button className="carousel-button prev-button" onClick={scrollPrev} disabled={currentIndex === 0}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="progress-track">
              <div
                className="progress-indicator"
                style={{
                  width: `50%`,
                  transform: `translateX(${currentIndex * 100}%)`,
                }}
              ></div>
            </div>
            <button className="carousel-button next-button" onClick={scrollNext} disabled={currentIndex >= maxIndex}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <a href="/events#filters" className="see-more-link">
            see more <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  )
}

export default RecentEventsSection
