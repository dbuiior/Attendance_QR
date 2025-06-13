import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Building2, FolderPlus, CalendarDays } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMeeting = () => {
    const {project_id} = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSucess] = useState(false);
    const [formData, setFormData] = useState({
        title:'',
        start_date:'',
    });

    const handleChange = (e) => {
        const {name , value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try{
            await axios.post(`http://localhost:8081/add-new-meeting/${project_id}`,{
                title: formData.title,
                start_date: formData.start_date
            })
            
            setIsSucess(true)
            setTimeout(() => navigate(-1),2000) 
        }catch (error){
            console.error('Error adding meeting: ', error)
            alert('Failed to add new meeting')
        }
    }

    if(isSuccess){
        return (
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <div className='text-center'>
                    <h3>Meeting added sucessfully!</h3>
                </div>
            </div>
        )
    }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-primary">
         <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
           <div className="text-center mb-4">
             <FolderPlus size={32} className="mb-2 text-primary" />
             <h4 className="fw-bold">Add New Meeting</h4>
           </div>
           <form onSubmit={handleSubmit}>
             <div className="mb-3">
               <label htmlFor="project_name" className="form-label">
                 <FolderPlus size={16} className="me-1" />
                 Meeting Title
               </label>
               <input
                 type="text"
                 className="form-control border border-3"
                 placeholder='Enter Meeting Title'
                 id="title"
                 name="title"
                 value={formData.title}
                 onChange={handleChange}
                 required
               />
             </div>
              <div className="mb-3">
               <label htmlFor="start_date" className="form-label">
                 <CalendarDays size={16} className="me-1" />
                 Start Date
               </label>
               <input
                 type="date"
                 className="form-control border border-3"
                 placeholder='Starting Date'
                 id="start_date"
                 name="start_date"
                 value={formData.start_date}
                 onChange={handleChange}
                 required
               />
             </div>
             <button type="submit" className="btn btn-primary w-100">
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
  )
}

export default AddMeeting
