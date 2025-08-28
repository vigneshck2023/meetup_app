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
    "Ethnic Theme",
  ];

  const ageRestrictions = ["18+ only", "21+ only", "All Ages Welcome"];

  const descriptions = [
    `Dive into the future of technology with a full-day conference featuring industry leaders, hands-on workshops, and live demos on artificial intelligence, blockchain, and next-generation computing.

Highlights of the event include:
• Keynote talks from global innovators  
• Hands-on coding labs for AI and Web3  
• A panel discussion on digital transformation trends  

Attendees will also get exclusive insights into upcoming tech trends shaping the next decade, along with networking opportunities with CTOs, investors, and product designers.`,

    `An international summit dedicated to artificial intelligence, machine learning, and robotics innovations. Experts from around the globe will share groundbreaking research, case studies, and future applications of AI across industries.

What you can expect:
• In-depth keynote speeches from AI pioneers  
• Workshops on deep learning, NLP, and computer vision  
• Networking opportunities with AI professionals and startups`,

    `An expo on sustainable living featuring eco-friendly product showcases, expert-led workshops, and inspiring talks on renewable energy, waste management, and conscious consumption.

Visitors can:
• Explore 100+ eco-friendly brands  
• Attend DIY recycling workshops  
• Hear from climate activists and innovators  

This is an excellent opportunity to learn how small lifestyle changes can make a huge impact on the planet.`,

    `A healthcare innovation forum focusing on digital health, telemedicine, biotechnology, and medical devices.

Key highlights:
• Panel discussions with leading doctors and health tech founders  
• Live demos of healthcare apps and medical devices  
• Sessions on the future of personalized medicine and preventive care`,

    `A startup pitch fest where emerging founders showcase their ideas to a panel of investors and mentors.

Agenda:
• Morning workshops on fundraising strategies  
• Afternoon startup pitches across sectors  
• Networking mixer with investors in the evening  

This event is perfect for aspiring entrepreneurs looking to connect with the ecosystem and gain practical insights into scaling businesses in today’s competitive market.`,

    `A cyber security workshop designed to equip professionals and students with practical skills to defend against modern cyber threats.

What you’ll gain:
• Hands-on labs on penetration testing and ethical hacking  
• Sessions on cloud security, data privacy, and threat detection  
• Expert talks from CISOs and cyber defense specialists`,
  ];

  const times = [
    { start: "09:00", end: "15:00" },
    { start: "10:30", end: "18:00" },
    { start: "11:00", end: "17:30" },
    { start: "13:00", end: "19:00" },
    { start: "09:30", end: "13:30" },
    { start: "14:00", end: "20:00" },
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
    const [hour, minute] = timeString.split(":");
    const dateObj = new Date();
    dateObj.setHours(parseInt(hour), parseInt(minute));
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  useEffect(() => {
    fetch(`https://meetup-application-h68v.vercel.app/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const venueIndex = getIndexFromId(id, venues.length);
        const dressIndex = getIndexFromId(id, dressCodes.length);
        const ageIndex = getIndexFromId(id, ageRestrictions.length);
        const descIndex = getIndexFromId(id, descriptions.length);
        const timeIndex = getIndexFromId(id, times.length);

        data.venue = venues[venueIndex];
        data.description = descriptions[descIndex];
        data.dressCode = data.dressCode || dressCodes[dressIndex];
        data.ageRestriction = data.ageRestriction || ageRestrictions[ageIndex];
        data.tags = data.tags && data.tags.length > 0 ? data.tags : ["Technology", "Networking", "Innovation"];
        data.speakers =
          data.speakers && data.speakers.length > 0
            ? data.speakers
            : [
                { name: "Amit Verma", role: "CTO, InnovateX" },
                { name: "Sarah Lee", role: "AI Researcher" },
                { name: "Ravi Kumar", role: "Product Designer" },
              ];
        data.startTime = data.startTime || times[timeIndex].start;
        data.endTime = data.endTime || times[timeIndex].end;

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
        <img src={meetupLogo} alt="Meetup Logo" style={{ height: "60px", marginRight: "10px" }} />
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
          {event.host && <p className="text-muted"><strong>Hosted By:</strong> {event.host}</p>}

          <h5 className="mb-2">Details:</h5>
          <p className="whitespace-pre-line">{event.description}</p>

          {event.dressCode && <p><strong>Dress Code:</strong> {event.dressCode}</p>}
          {event.ageRestriction && <p><strong>Age Restriction:</strong> {event.ageRestriction}</p>}

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
            {event.startTime && event.endTime && (
              <p className="mb-2">
                <i className="bi bi-clock"></i> <strong>Time:</strong> {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </p>
            )}
            {event.price && <p className="mb-0"><strong>Price:</strong> ₹{event.price}</p>}
          </div>

          {event.venue && (
            <div className="card shadow-sm p-3 mb-4">
              <h5 className="mb-3">Venue Details</h5>
              {event.venue.name && <p className="mb-2"><i className="bi bi-building"></i> {event.venue.name}</p>}
              {event.venue.address && <p className="mb-2"><i className="bi bi-geo-alt"></i> {event.venue.address}</p>}
            </div>
          )}

          <h5 className="mt-4 mb-3">Speakers:</h5>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {event.speakers && event.speakers.length > 0 ? (
              event.speakers.map((speaker, index) => (
                <div key={index} className="card text-center p-2" style={{ width: "120px" }}>
                  <img
                    src={passedImage || techImg}
                    alt={speaker.name}
                    className="img-fluid rounded-circle mb-2"
                    style={{ height: "80px", width: "80px", objectFit: "cover" }}
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
