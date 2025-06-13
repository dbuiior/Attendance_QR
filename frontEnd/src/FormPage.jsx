import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FormPage = () => {
  const { event_id } = useParams();
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeePosition, setAttendeePosition] = useState("");
  const [success, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8081/get-event-details/${event_id}`)
      .then((res) => setEventDetails(res.data))
      .catch((err) => {
        console.error("Failed to fetch event details", err);
        setError("Failed to load event information");
      });
  }, [event_id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    axios
      .post("http://localhost:8081/submit-attendance", {
        event_id,
        attendee_name: attendeeName,
        attendee_position: attendeePosition,
        attendance_time: currentTime,
      })
      .then(() => {
        setSuccess(true);
        setAttendeeName("");
        setAttendeePosition("");
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Submission error:", err);
        setError("Failed to submit attendance");
      });
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-center">Meeting Attendance</h2>

        {eventDetails && (
          <div className="mb-4 text-center">
            <h4>{eventDetails.title}</h4>
            <p className="text-muted">Date: {eventDetails.start_date}</p>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Position</label>
            <input
              type="text"
              className="form-control"
              value={attendeePosition}
              onChange={(e) => setAttendeePosition(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit Attendance
          </button>
        </form>

        {success && (
          <div className="alert alert-success mt-3">
            Attendance submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
