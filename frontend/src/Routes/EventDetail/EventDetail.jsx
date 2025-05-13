import React from "react";
import "./EventDetail.css";
import { Bs1CircleFill, Bs2CircleFill, Bs3CircleFill } from "react-icons/bs";
import { IoLinkSharp, IoLocationSharp } from "react-icons/io5";
import { MdOutlineMoneyOffCsred } from "react-icons/md";
import { GiSandsOfTime } from "react-icons/gi";
import logoevent from "../../assets/daynasor.jpg";
import logoorganizer from "../../assets/daynasor.jpg";

const EventComponent = ({ event }) => {
  const currentEvent = event || {
    eventName: "Nextrace",
    organizerId: {
      organizationName: "NEXUS",
      logo: logoorganizer,
    },
    eventDate: "2024-11-12",
    eventType: "CTF",
    eventMode: "ON-Site",
    isFree: false,
    category: "AI",
    description:
      "ByteCraft is the biggest scientific club of école supérieure en sciences et technologies de l'informatique et du numérique (ESTIN), it focuses mainly on computer science fields. Its primary goal is providing a helpful & flexible social environment where students can learn, enjoy & improve.",
    location: "Estim-Amizour Bejaia",
    deadline: "2024-10-12",
    prizes: ["PCs", "PCs", "PCs"],
    cost: "12000DA",
    logo: logoevent,
    sponsors: [
      {
        name: "Djezzy",
        logo: logoevent,
       
      },
      {
        name: "Ooredoo",
        logo: logoevent,
       
      },
      {
        name: "Algerie Post",
        logo: logoevent,
        
      },
    ],
    eventLink: "www.youtube.com",
    notes:
      "ByteCraft is the biggest scientific club of école supérieure en sciences et technologies de l'informatique et du numérique (ESTIN), it focuses mainly on computer science fields. Its primary goal is providing a helpful & flexible social environment where students can learn, enjoy & improve.",
  };
  // Format date helper
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get place text helper
  const getPlaceText = (place) => {
    switch (place) {
      case 1:
        return "first";
      case 2:
        return "second";
      case 3:
        return "Third";
      default:
        return `${place}th`;
    }
  };

  return (
    <div className="event-detail-container">
      <div className="event-header">
        <div className="event-organizername">
          {" "}
          {currentEvent.logo && (
            <img
              src={currentEvent.logo}
              alt={currentEvent.eventName}
              className="event-logo"
            />
          )}{" "}
          <h1 className="event-name">{currentEvent.eventName}</h1>
        </div>
        <div className="event-tags">
          <div className="event-tag event-organizer">
            <div>
              {" "}
              Organized by{" "}
              {currentEvent.organizerId?.organizationName || "Unknown"}
            </div>
            {currentEvent.organizerId?.logo && (
              <img
                src={currentEvent.organizerId.logo}
                alt={`${currentEvent.organizerId.organizationName} logo`}
                className="organizer-logo"
              />
            )}{" "}
          </div>
          <div className="event-tag event-date">
            AT {formatDate(currentEvent.eventDate)}
          </div>
        </div>
        <div className="event-badges">
          <div className="event-badge">{currentEvent.eventType}</div>
          <div className="event-badge">{currentEvent.eventMode}</div>
          <div className="event-badge">
            {currentEvent.isFree ? "free" : "paying"}
          </div>
          {currentEvent.category && (
            <div
              className={`event-badge category-badge ${currentEvent.category.toLowerCase()}-badge`}
            >
              {currentEvent.category}
            </div>
          )}
        </div>
      </div>
      <section className="event-section">
        <h2>Description</h2>
        <div className="event-section-content">
          <p className="event-info">{currentEvent.description}</p>
        </div>
      </section>
      {currentEvent.eventMode === "ON-Site" && currentEvent.location && (
        <section className="event-section">
          <h2>Location</h2>
          <div className="event-section-content event-with-icon">
            <IoLocationSharp className="event-section-icon" size={20} />
            <p className="event-info">{currentEvent.location}</p>
          </div>
        </section>
      )}
      <section className="event-section">
        <h2>Deadline</h2>
        <div className="event-section-content event-with-icon">
          <GiSandsOfTime className="event-section-icon" size={20} />
          <p className="event-info">{formatDate(currentEvent.deadline)}</p>
        </div>
      </section>
      {currentEvent.prizes && currentEvent.prizes.length > 0 && (
        <section className="event-section">
          <h2>Prizes</h2>
          <div className="event-section-content">
            {currentEvent.prizes.map((prize, index) => (
              <div key={index} className="event-prize-item event-with-icon">
                {index === 0 && (
                  <Bs1CircleFill
                    className="event-section-icon"
                    size={20}
                    color="gold"
                  />
                )}
                {index === 1 && (
                  <Bs2CircleFill
                    className="event-section-icon"
                    size={20}
                    color="silver"
                  />
                )}
                {index === 2 && (
                  <Bs3CircleFill
                    className="event-section-icon"
                    size={20}
                    color="#cd7f32"
                  />
                )}
                <p className="event-info">{currentEvent.cost}</p>
                <p>{`${getPlaceText(index + 1)} place : ${prize}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {!currentEvent.isFree && currentEvent.cost && (
        <section className="event-section">
          <h2>Cost</h2>
          <div className="event-section-content event-with-icon">
            <MdOutlineMoneyOffCsred className="event-section-icon" size={20} />
            <p className="event-info">{currentEvent.cost}</p>
          </div>
        </section>
      )}
      {currentEvent.sponsors && currentEvent.sponsors.length > 0 && (
        <section className="event-section">
          <h2>Sponsors</h2>
          <div className="sponsors-grid">
            {currentEvent.sponsors.map((sponsor, index) => (
              <div key={index} className="sponsor-item">
                {sponsor.logo && (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="sponsor-logo"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <span className="sponsor-name">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}{" "}
      {currentEvent.eventLink && (
        <section className="event-section">
          <h2>Link</h2>
          <div className="event-section-content event-with-icon">
            <IoLinkSharp className="event-section-icon" size={20} />
            <a
              href={currentEvent.eventLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
            >
              {currentEvent.eventLink}
            </a>
          </div>
        </section>
      )}
      {currentEvent.notes && (
        <section className="event-section">
          <h2>Adiition infos</h2>
          <div className="event-section-content">
            <p className="event-info">{currentEvent.notes}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default EventComponent;
