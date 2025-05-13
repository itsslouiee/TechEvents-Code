import { useState, useEffect } from "react"
import OrgCard from "./orgcard"
import { getAllOrganizers } from "../../api/organizerApi"

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(20, 20, 50, 0.6)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const contentStyles = {
  background: "#18105a",
  borderRadius: "2rem",
  padding: "2.5rem 2.5rem 1.5rem 2.5rem",
  minWidth: 400,
  minHeight: 400,
  maxWidth: 500,
  width: "90vw",
  maxHeight: "80vh",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  position: "relative",
  display: "flex",
  flexDirection: "column"
}

const closeBtnStyles = {
  position: "absolute",
  top: 20,
  right: 30,
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: 28,
  cursor: "pointer"
}

const scrollListStyles = {
  flex: 1,
  overflowY: "auto",
  marginTop: 24,
  marginBottom: 8,
  display: "flex",
  flexDirection: "column",
  gap: 15
}

const sortContainerStyles = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8
}

function SeemoreModal({ open, onClose }) {
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    getAllOrganizers(sortBy)
      .then(data => {
        setOrganizers(data)
      })
      .catch(err => {
        console.error('Error fetching organizers:', err)
        setError("Failed to load organizers")
      })
      .finally(() => setLoading(false))
  }, [open, sortBy])

  if (!open) return null

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <button style={closeBtnStyles} onClick={onClose} title="Close">×</button>
        <div style={sortContainerStyles}>
          <span style={{ color: "#fff", fontSize: 18 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ borderRadius: 8, padding: "4px 12px", fontSize: 16 }}
          >
            <option value="name">Name (A-Z)</option>
            <option value="events">Number of Events</option>
            <option value="views">Popularity</option>
          </select>
        </div>
        <div style={scrollListStyles}>
          {loading && <div style={{ color: "#fff", textAlign: "center" }}>Loading...</div>}
          {error && <div style={{ color: "#fff", textAlign: "center" }}>{error}</div>}
          {!loading && !error && organizers.length === 0 && (
            <div style={{ color: "#fff", textAlign: "center" }}>No organizers found</div>
          )}
          {!loading && !error && organizers.map(org => (
            <div key={org._id} style={{ marginBottom: 8 }}>
              <OrgCard
                organizer={{
                  id: org._id,
                  name: org.organizationName,
                  logoUrl: org.logo,
                  eventCount: org.eventCount,
                  link: `/organizers/${org._id}`
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SeemoreModal
