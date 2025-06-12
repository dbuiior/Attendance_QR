import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, FolderPlus } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMeeting = () => {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSucess] = useState(false);
    const [formData, setFormData] = useState({
        title:'',
        qr_link: ''
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
        try{
            await axios.post('http://localhost:8081/add-new-meeting')
            setIsSucess(true)
            setTimeout(() => navigate(-1),2000) 
        }catch{
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
           <form>
             <div className="mb-3">
               <label htmlFor="project_name" className="form-label">
                 <FolderPlus size={16} className="me-1" />
                 Meeting Title
               </label>
               <input
                 type="text"
                 className="form-control border border-3"
                 placeholder='Enter Project Name'
                 id="project_name"
                 name="project_name"
                //  value={formData.project_name}
                //  onChange={handleChange}
                 required
               />
             </div>
             <div className="mb-3">
               <label htmlFor="company" className="form-label">
                 <Building2 size={16} className="me-1" />
                 QR_Link
               </label>
               <input
                 type="text"
                 className="form-control border border-3"
                 placeholder='Enter Company Name'
                 id="company"
                 name="company"
                //  value={formData.company}
                //  onChange={handleChange}
                 required
               />
             </div>
             <button type="submit" className="btn btn-primary w-100">
               {/* {isSubmitting ? (
                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
               ) : (
                 <Plus size={16} className="me-2" />
               )}
               {isSubmitting ? 'Creating...' : 'Create Project'} */}
               Submit Gaming
             </button>
           </form>
         </div>
       </div>
  )
}

export default AddMeeting
