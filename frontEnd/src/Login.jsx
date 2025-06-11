import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate =  useNavigate();
    const [logoutMessage, setLogoutMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    useEffect(() => {
      const message = localStorage.getItem('logoutMessage')
      if(message){
        setLogoutMessage(message)
        localStorage.removeItem('logoutMessage')
      }
    }, []);

    useEffect(() => {
      if(logoutMessage) {
        const timer = setTimeout(() => {
          setLogoutMessage('')
        }, 1500);

        return () => clearTimeout(timer);
      }
    }, [logoutMessage]);
    
    
    function handleSubmit(event){
        event.preventDefault()
        axios.post('http://localhost:8081/', { email, password })
            .then(res => {
              console.log(res.data);
              if(res.data.message === 'Login Success'){
                localStorage.setItem('first_name',res.data.first_name)
                navigate('/home')
              }
              else{
                console.log(res.data)
                alert('Login Failed')
              }
            })
            .catch(err => {
              console.error(err);
              alert('Something went wrong');
            })
    }

  return (
  <div className='vh-100 d-flex justify-content-center align-items-center bg-primary position-relative'>
    {logoutMessage && (
      <div className="alert alert-success position-fixed" 
           style={{
             top: '20px',
             right: '20px',
           }} 
           role="alert">
        {logoutMessage}
      </div>
    )}
    <div className='p-3 bg-white w-25 rounded shadow'>
      <h4 className='mb-3 text-center'>Login</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            placeholder='Enter Email' 
            className='form-control' 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className='mb-3'>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            placeholder='Enter Password' 
            className='form-control' 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <div>
          <Link to="/register" className="mb-3 mt-3 text-decoration-none text-sm">
            Don't have an account?
          </Link>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <button className='btn btn-success mt-3 w-100'>Login</button>
        </div>
      </form>
    </div>
  </div>
)
}

export default Login
