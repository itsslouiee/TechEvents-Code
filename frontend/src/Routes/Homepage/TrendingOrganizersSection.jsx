import { useState, useEffect } from "react"
import OrganizerCard from "./OrganizerCard"
import { getTrendingOrganizers } from "../../api/organizerApi"
import SeemoreModal from "./seemore"

function TrendingOrganizersSection() {
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const data = await getTrendingOrganizers()
        // Check if data and trendingOrganizers exist
        if (data && data.trendingOrganizers) {
          setOrganizers(data.trendingOrganizers)
        } else {
          setError("No organizers data available")
        }
      } catch (err) {
        setError("Failed to load trending organizers")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizers()
  }, [])

  if (loading) {
    return (
      <section className="section trending-organizers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Organizers</h2>
            <p className="section-description">
              Discover the best and most popular clubs and enterprises in the Tech industry
            </p>
          </div>
          <div className="loading">Loading...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section trending-organizers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Organizers</h2>
            <p className="section-description">
              Discover the best and most popular clubs and enterprises in the Tech industry
            </p>
          </div>
          <div className="error">{error}</div>
        </div>
      </section>
    )
  }

  // Only render the organizers grid if we have organizers
  if (!organizers || organizers.length === 0) {
    return (
      <section className="section trending-organizers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Organizers</h2>
            <p className="section-description">
              Discover the best and most popular clubs and enterprises in the Tech industry
            </p>
          </div>
          <div className="no-data">No trending organizers available at the moment</div>
        </div>
      </section>
    )
  }

  return (
    <section className="section trending-organizers">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Trending Organizers</h2>
          <p className="section-description">
            Discover the best and most popular clubs and enterprises in the Tech industry
          </p>
        </div>

        <div className="organizers-grid">
          {organizers.map((organizer) => (
            <OrganizerCard 
              key={organizer._id} 
              organizer={{
                id: organizer._id,
                name: organizer.organizationName,
                logoUrl: organizer.logo,
                eventCount: organizer.eventCount,
                link: `/organizers/${organizer._id}`
              }} 
            />
          ))}
        </div>

        <div className="see-all-container">
          <button className="button primary-button" onClick={() => setShowModal(true)}>
            See All
          </button>
        </div>
        <SeemoreModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
    </section>
  )
}

export default TrendingOrganizersSection
