import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, FolderPlus } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_name: '',
    company: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8081/add-new-project', formData);
      setIsSuccess(true);
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="text-success fs-1 mb-3">✔</div>
          <h3>Project added successfully!</h3>
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <FolderPlus size={32} className="mb-2 text-primary" />
          <h4 className="fw-bold">Add New Project</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="project_name" className="form-label">
              <FolderPlus size={16} className="me-1" />
              Project Name
            </label>
            <input
              type="text"
              className="form-control border border-3"
              placeholder='Enter Project Name'
              id="project_name"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="company" className="form-label">
              <Building2 size={16} className="me-1" />
              Company
            </label>
            <input
              type="text"
              className="form-control border border-3"
              placeholder='Enter Company Name'
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : (
              <Plus size={16} className="me-2" />
            )}
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
