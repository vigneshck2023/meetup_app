import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import aiImg from "./assets/ai.jpg";
import cyberImg from "./assets/cyber.jpg";
import greenImg from "./assets/green.jpg";
import healthImg from "./assets/health.jpg";
import startupImg from "./assets/startup.jpg";
import techImg from "./assets/tech.jpg";
import meetupLogo from "./assets/meetup.png";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const images = [techImg, aiImg, greenImg, healthImg, startupImg, cyberImg];

  useEffect(() => {
    fetch("https://meetup-application-h68v.vercel.app/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" ? true : event.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Header with logo */}
      <div className="d-flex align-items-center justify-content-center mb-4">
        <img
          src={meetupLogo}
          alt="Meetup Logo"
          style={{ height: "60px", marginRight: "10px" }}
        />
        <h1 className="mb-0">Upcoming Events</h1>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Events</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="row">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-muted">No events found.</p>
        ) : (
          filteredEvents.map((event, index) => (
            <div key={event._id} className="col-md-4 mb-4">
              <Link
                to={`/events/${event._id}`}
                state={{ image: images[index % images.length] }}
                className="text-decoration-none text-dark"
              >
                <div
                  className="card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <div className="position-relative">
                    <img
                      src={images[index % images.length]}
                      className="card-img-top rounded-top"
                      alt={event.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <span
                      className={`badge position-absolute top-0 start-0 m-2 px-3 py-2 ${
                        event.type === "Online" ? "bg-primary" : "bg-success"
                      }`}
                      style={{ fontSize: "0.9rem", opacity: 0.9 }}
                    >
                      {event.type} Event
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p className="card-text text-muted mb-1">
                      {formatDateTime(event.date)}
                    </p>
                    <h5 className="card-title">{event.title}</h5>
                    <div className="mb-2">
                      {event.eventTags &&
                        event.eventTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary me-1 mb-1"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <p className="card-text text-truncate">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
