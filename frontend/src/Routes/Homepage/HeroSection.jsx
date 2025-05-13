import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search)}`);
    } else {
      navigate("/events");
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="/images/hero.png"
          alt="Hero Background"
          className="hero-bg-image"
        />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">Discover Tech Events <br/> Across Algeria</h1>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">+50</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">+20</div>
            <div className="stat-label">Organizers</div>
          </div>
        </div>

        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" style={{ background: "none", border: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
            <i className="fas fa-search search-icon"></i>
          </button>
        </form>

        <p className="hero-description">Find hackathons, coding competitions, and tech events near you.</p>
      </div>
    </section>
  );
}

export default HeroSection;
