import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const Home = () => {
  const [firstName, setFirstName] = useState('');
  const [project, setProject] = useState([]);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('first_name');
    console.log('Stored name:', name);
    setFirstName(name || 'User');
    
    const message = localStorage.getItem('loginMessage');
    if (message) {
      setLoginMessage(message);
      localStorage.removeItem('loginMessage');
      
      const timer = setTimeout(() => {
        setLoginMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }

    const newProjectMsg = localStorage.getItem('projectAdded');
    if (newProjectMsg) {
      setLoginMessage(newProjectMsg);
      localStorage.removeItem('projectAdded');
      setTimeout(() => setLoginMessage(''), 5000);
    }

    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://localhost:8081/home')
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching Data', error);
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8081/logout', {}, {
        withCredentials: true
      });

      localStorage.setItem('logoutMessage', response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutMessage('Gagal logout');
    }
  };

  return (
    <div className='min-vh-100 bg-light'>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <div className="navbar-brand mb-0 h1">
            <i className="fas fa-home me-2"></i>Dashboard
          </div>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, <strong className='text-light'>{firstName}</strong>
            </span>
            <div className='gap-3'>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i>Logout
              </button>
              <button className='btn btn-outline-light btn-sm'>
                <i>Edit Profile</i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <button
          className="btn btn-outline-success d-flex align-items-center gap-2 mb-5"
          onClick={() => navigate('/add-new-project')}
        >
          <i className="fa-solid fa-plus"></i>
          Add New Project List
        </button>

        {loginMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            <strong>Success!</strong> {loginMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setLoginMessage('')}
            ></button>
          </div>
        )}

        {logoutMessage && (
          <div className={`alert ${logoutMessage === 'Logout Success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            <i className={`fas ${logoutMessage === 'Logout Success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
            <strong>{logoutMessage === 'Logout Success' ? 'Success!' : 'Error!'}</strong> {logoutMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setLogoutMessage('')}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-project-diagram me-2 text-primary"></i>
                      Project List
                    </h5>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-primary">{project.length} Projects</span>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading projects...</p>
                  </div>
                ) : project.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Projects Found</h5>
                    <p className="text-muted">You haven't created any projects yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive mb-4">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-center">No</th>
                          <th scope="col">
                            <i className="fas fa-folder me-2"></i>Project Name
                          </th>
                          <th scope="col">
                            <i className="fas fa-building me-2"></i>Company
                          </th>
                          <th scope="col" className="text-center">
                            <i className="fas fa-qrcode me-2"></i>Meeting List
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.map((item, index) => (
                          <tr key={index}>
                            <th scope="row" className="text-center text-muted">
                              {index + 1}
                            </th>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="fas fa-project-diagram"></i>
                                </div>
                                <div>
                                  <strong className="text-dark">{item.project_name}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary bg-opacity-20">
                                {item.company}
                              </span>
                            </td>
                            <td className="text-center">
                              <button className='btn btn-primary' onClick={() => navigate(`/view-meeting/${item.project_id}`)}>View Meeting List</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
