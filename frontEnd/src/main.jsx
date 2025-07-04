import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Home from './Home.jsx'
import AddProject from './AddProject.jsx';
import ViewMeeting from './ViewMeeting.jsx';
import AddMeeting from  './AddMeeting.jsx';
import EditProfile from './EditProfile.jsx';
import FormPage from './FormPage.jsx'; // ⬅️ Import new page


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/add-new-project" element={<AddProject />} />
        <Route path="/view-meeting/:project_id" element={<ViewMeeting />} />
        <Route path="/add-new-meeting/:project_id" element={<AddMeeting />} />     
        <Route path="/edit-profile/:user_id" element={<EditProfile />} />
        <Route path="/forms/:project_id/:event_id" element={<FormPage />} /> {/* ✅ New QR form route */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
