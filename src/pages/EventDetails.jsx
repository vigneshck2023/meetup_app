import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import techImg from "../assets/tech.jpg";
import meetupLogo from "../assets/meetup.png";

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const passedImage = location.state?.image;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const venues = [
    { name: "Grand Convention Center", address: "123 Main Street, Bengaluru, India" },
    { name: "Tech Park Auditorium", address: "456 IT Hub Road, Hyderabad, India" },
    { name: "City Expo Hall", address: "789 Central Avenue, Mumbai, India" },
    { name: "Innovation Hub", address: "12 Startup Lane, Chennai, India" },
    { name: "Cultural Convention Hall", address: "88 Heritage Road, Delhi, India" },
  ];

  const dressCodes = [
    "Smart Casuals",
    "Formal Attire",
    "Traditional Wear",
    "Business Casuals",
    "Ethnic Theme"
  ];

  const ageRestrictions = [
    "18+ only",
    "21+ only",
    "All Ages Welcome",
  ];

  function getIndexFromId(eventId, listLength) {
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      hash = (hash << 5) - hash + eventId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % listLength;
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(timeString) {
    if (!timeString) return "";
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    try {
      const [hour, minute] = timeString.split(":");
      const dateObj = new Date();
      dateObj.setHours(parseInt(hour), parseInt(minute));
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  }

  useEffect(() => {
    fetch(`https://meetup-application-h68v.vercel.app/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const venueIndex = getIndexFromId(id, venues.length);
        const dressIndex = getIndexFromId(id, dressCodes.length);
        const ageIndex = getIndexFromId(id, ageRestrictions.length);

        data.venue = venues[venueIndex];

        if (!data.description) {
          data.description =
            "Join us for an engaging evening filled with networking opportunities, insightful sessions, and interactive discussions on emerging industry trends.";
        }
        if (!data.dressCode) {
          data.dressCode = dressCodes[dressIndex];
        }
        if (!data.ageRestriction) {
          data.ageRestriction = ageRestrictions[ageIndex];
        }
        if (!data.tags || data.tags.length === 0) {
          data.tags = ["Technology", "Networking", "Innovation"];
        }
        if (!data.speakers || data.speakers.length === 0) {
          data.speakers = [
            { name: "Amit Verma", role: "CTO, InnovateX" },
            { name: "Sarah Lee", role: "AI Researcher" },
            { name: "Ravi Kumar", role: "Product Designer" },
          ];
        }

        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!event) return <div className="text-center mt-5">Event not found</div>;

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-center mb-4">
        <img
          src={meetupLogo}
          alt="Meetup Logo"
          style={{ height: "60px", marginRight: "10px" }}
        />
        <h1 className="mb-0">Event Details</h1>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Link to="/" className="btn btn-outline-secondary mb-4">
        ← Back to Events
      </Link>

      <div className="row">
        <div className="col-md-8">
          <img
            src={passedImage || techImg}
            alt={event.title}
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
          />
          <h2 className="mb-3">{event.title}</h2>
          {event.host && (
            <p className="text-muted">
              <strong>Hosted By:</strong> {event.host}
            </p>
          )}

          <h5 className="mb-2">Details:</h5>
          {event.description && <p>{event.description}</p>}
          {event.dressCode && (
            <p>
              <strong>Dress Code:</strong> {event.dressCode}
            </p>
          )}
          {event.ageRestriction && (
            <p>
              <strong>Age Restriction:</strong> {event.ageRestriction}
            </p>
          )}

          <h5 className="mt-4">Event Tags:</h5>
          <div className="mb-4">
            {event.tags && event.tags.length > 0 ? (
              event.tags.map((tag, i) => (
                <span key={i} className="badge bg-danger me-2">
                  {tag}
                </span>
              ))
            ) : (
              <span>No tags available</span>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="mb-3">Event Information</h5>
            {event.date && (
              <p className="mb-2">
                <i className="bi bi-calendar-event"></i> <strong>Date: </strong> {formatDate(event.date)}
              </p>
            )}
            {event.time && (
              <p className="mb-2">
                <i className="bi bi-clock"></i> {formatTime(event.time)}
              </p>
            )}
            {event.price && (
  <p className="mb-0">
    <strong>Price:</strong> ₹{event.price}
  </p>
)}
          </div>

          {event.venue && (
            <div className="card shadow-sm p-3 mb-4">
              <h5 className="mb-3">Venue Details</h5>
              {event.venue.name && (
                <p className="mb-2">
                  <i className="bi bi-building"></i> {event.venue.name}
                </p>
              )}
              {event.venue.address && (
                <p className="mb-2">
                  <i className="bi bi-geo-alt"></i> {event.venue.address}
                </p>
              )}
            </div>
          )}

          <h5 className="mt-4 mb-3">Speakers:</h5>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {event.speakers && event.speakers.length > 0 ? (
              event.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="card text-center p-2"
                  style={{ width: "120px" }}
                >
                  <img
                    src={passedImage || techImg}
                    alt={speaker.name}
                    className="img-fluid rounded-circle mb-2"
                    style={{
                      height: "80px",
                      width: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <h6 className="mb-0">{speaker.name}</h6>
                  <p className="text-muted small">{speaker.role}</p>
                </div>
              ))
            ) : (
              <p>No speakers listed</p>
            )}
          </div>

          <button className="btn btn-danger w-100">RSVP</button>
        </div>
      </div>
    </div>
  );
}
