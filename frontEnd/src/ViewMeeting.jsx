import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams,useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';



const ViewSimpleMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const {project_id} = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    console.log('project id from url', project_id)
    axios.get(`http://localhost:8081/view-meeting/${project_id}`)
      .then(response => {
        setMeetings(response.data)
      })
      .catch(error => {
        console.error('Error fetching meetings:', error)
      })
  }, [project_id])

  return (
    <div className='container-fluid vh-100'>
      <button className='btn btn-outline-success outline-none mb-5 mt-5' onClick={() => navigate('/add-new-meeting')}>
        <i className="fa-solid fa-plus me-3"></i>
          Add New Meeting
        </button>
      <h2 className="mb-4 text-center">Meeting Titles & QR Links</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr className='text-center'>
              <th>Title</th>
              <th>QR Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length > 0 ? (
              meetings.map((meeting, index) => (
                <tr key={index}>
                  <td>{meeting.title}</td>
                  <td>
                    <a href={meeting.qr_link} target="_blank" rel="noopener noreferrer">
                      {meeting.qr_link}
                    </a>
                  </td>
                  <td>
                    <div className='d-flex justify-content-center align-items-center gap-3'>
                        <button className='btn btn-success outline-none'>Edit</button>
                        <button className='btn btn-danger outline none'>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">No meetings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  </div>
  )
}

export default ViewSimpleMeeting
