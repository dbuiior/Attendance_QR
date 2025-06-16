import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import QRCode from "react-qr-code";

const ViewSimpleMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const { project_id } = useParams();
  const { event_id } = useParams();
  const navigate = useNavigate();
  const [qrInfo, setQrInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Arial, sans-serif",
    },
    addButton: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
  };


  const handleDelete = (event_id) => {
    console.log("Deleting event with ID:", event_id ); 
    axios.delete(`http://localhost:8081/delete-meeting/${event_id}`)
    .then(() => {
      alert('Event Delete Succesfully')
      setMeetings(prev => prev.filter(meeting => meeting.event_id !== event_id));
    })
    .catch((error) => {
      console.error('Error Deleting Event',error)
      alert('Attendee Already Attend the Meeting')
    })
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8081/view-meeting/${project_id}`)
      .then((response) => setMeetings(response.data))
      .catch((error) => console.error("Error fetching meetings:", error));
  }, [project_id]);

  const handleShowQR = (pid, eid) => {
    setQrInfo({ pid, eid });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setQrInfo(null);
  };

  return (
    <div style={styles.container}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <button
          className="btn"
          style={styles.addButton}
          onClick={() => navigate(`/add-new-meeting/${project_id}`)}
        >
          <i className="fas fa-plus me-2"></i>Add New Meeting
        </button>
        <button
          className="btn btn-outline-primary ms-auto"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left me-1"></i> Back
        </button>
      </nav>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white">Meeting List</h2>
        </div>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Total Meetings</h5>
                  <h3>{meetings.length}</h3>
                </div>
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.length > 0 ? (
                    meetings.map((meeting, index) => (
                      <tr key={index}>
                        <td className="text-capitalize">{meeting.title}</td>
                        <td>
                          <span>
                            <i className="fas fa-link me-1"></i>
                            {meeting.start_date}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="fas fa-edit me-1"></i>Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={()=> handleDelete(meeting.event_id)}
                            >
                              <i className="fas fa-trash-alt me-1"></i>Delete
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() =>
                                handleShowQR(project_id, meeting.event_id)
                              }
                            >
                              <i className="fas fa-qrcode me-1"></i>QR
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-muted py-4">
                        No meetings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ QR Modal */}
      {showModal && qrInfo && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="modal-title">Scan to Join Meeting</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <QRCode
                  value={`http://localhost:5173/forms/${qrInfo.pid}/${qrInfo.eid}`}
                />
                <p className="mt-3 text-muted small">
                  URL: /forms/{qrInfo.pid}/{qrInfo.eid}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSimpleMeeting;
