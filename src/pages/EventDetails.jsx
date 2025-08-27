import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import techImg from "../assets/tech.jpg";

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const passedImage = location.state?.image;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!event) return <div className="text-center mt-5">Event not found</div>;

  return (
    <div className="container my-4">
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
          {event.description && (
            <>
              <h5 className="mb-2">Details:</h5>
              <p>{event.description}</p>
            </>
          )}
          {(event.dressCode || event.ageRestriction) && (
            <>
              <h5 className="mt-4">Additional Information:</h5>
              {event.dressCode && (
                <p>
                  <strong>Dress Code:</strong> {event.dressCode}
                </p>
              )}
              {event.ageRestriction && (
                <p>
                  <strong>Age Restrictions:</strong> {event.ageRestriction}
                </p>
              )}
            </>
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
            {(event.date || event.time) && (
              <p>
                <i className="bi bi-clock"></i>{" "}
                {event.date && formatDate(event.date)} <br />
                {event.time && formatTime(event.time)}
              </p>
            )}
            {event.location && (
              <p>
                <i className="bi bi-geo-alt"></i> {event.location}
              </p>
            )}
            {event.price && (
              <p>
                <strong>₹ {event.price}</strong>
              </p>
            )}
          </div>
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
