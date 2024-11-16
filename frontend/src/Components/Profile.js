// Example: Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data (e.g., token)
    localStorage.removeItem('authToken');

    // Redirect to login page
    navigate('/');
  };

  return (
    <div class="dark:bg-gray-900">
    <Navbar/>
    <div className="profile-container p-4 ">
      <h2 className="text-2xl font-semibold">Your Profile</h2>
      <p>Welcome, [Username]</p>

      {/* Logout button */}
      <button 
        onClick={handleLogout} 
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
    </div>
  );
};

export default Profile;
