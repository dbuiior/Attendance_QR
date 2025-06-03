import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { Link } from 'react-router-dom';

const Register = () => {
    const [first_name, setFirst_name] = useState('')
    const[last_name, setLast_name] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')



    function handleSubmit(event){
        event.preventDefault();

        if(!first_name || !last_name || !email || !password){
            alert('All Field Must be Filled')
            return;
        }

        axios.post('http://localhost:8081/register',{first_name, last_name ,email,password})
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }

  return (
    <div className='vh-100 d-flex justify-content-center align-items-center bg-primary'>
      <div className='p-4 bg-white shadow rounded w-25'>
        <h4 className='mb-3 text-center'>Register</h4>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="">First Name</label>
            <input type='text' name='first_name' placeholder='Enter First Name' className='form-control' onChange={(e) => setFirst_name(e.target.value)}/>
          </div>
          <div className='mb-3'>
            <label htmlFor="">Last Name</label>
            <input type='text' name='last_name' placeholder='Enter Last Name' className='form-control' onChange={(e) => setLast_name(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor="">Email</label>
            <input type='email' name='email' placeholder='Enter Email' className='form-control' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor="">Password</label>
            <input type='password' name='password' placeholder='Enter Password' className='form-control' onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className='mb-3 mt-3'>
            <Link to="/" className='text-decoration-none'>
              Already have an account
            </Link>
          </div>
          <button className='btn btn-success w-100'>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
