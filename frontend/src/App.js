import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import React, { useEffect } from 'react';
import HomePage from './Components/Homepage';
import CreateDiaryPage from './Components/Create';
// import Navbar from './Components/Navbar'
// import Card from './Components/Card'
import Signup from './Components/Signup';
import Login from './Components/Login';
import './index.css';
import './App.css';
import Profile from './Components/Profile';
import Dashboard from './Components/Dashboard';
import Support from './Components/Support';
import Journal from './Components/Journal';
import Update from './Components/Update.Journal';
import EditProfilePage from './Components/EditProfilePage';
import VerifyOtpPage from "./Components/VerifyOtpPage";


// Add the Forgot Password and Reset Password imports
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';


function App() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('authToken'); // Remove expired token
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  return (
   

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateDiaryPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/edit/:id" element={<EditProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Support />} />
        <Route path="/journal/entry/:id" element={<Journal />} />
        <Route path="/update/:id" element={<Update />} />

        {/* Add routes for Forgot Password and Reset Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>

  );

}

export default App;
