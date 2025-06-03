import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Home = () => {
  const [firstName, setFirstName] = useState('');
  const [project, setProject] = useState([]);



  useEffect(() => {
    const name = localStorage.getItem('first_name');
    console.log('Stored name:', name);
    setFirstName(name);
    
    axios.get('http://localhost:8081/home')
    .then(respone => {
      setProject(respone.data);
    })
    .catch(error => {
      console.error('Error Fetching Data', error);
    })
  }, []);

  return (
    <div className='vh-100'>
        <div>
            <h1>This is homepage</h1>
            <h2>Hello {firstName}</h2>
        </div>
        <ul>
            {project.map((item, index) => (
                <li key={index}>
                    <strong>Project:</strong> {item.project_name} <br />
                    <strong>Event:</strong> {item.company} <br />
                    <strong>Event:</strong> {item.qr_link}
                </li>
            ))}
        </ul>
    </div>
  );
};

export default Home;
