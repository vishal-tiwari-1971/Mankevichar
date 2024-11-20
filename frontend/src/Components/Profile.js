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
      <Navbar />
      <div className="profile-container p-5 flex justify-center items-center ">
        {/* <h2 className="text-2xl font-semibold">Your Profile</h2> */}
        {/* <p>Welcome, [Username]</p>

      {/* Logout button }
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button> */}
        <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-10 text-center w-80">
        <h2 className="text-2xl font-semibold text-black ">Your Profile</h2>
        <div className="flex justify-center">
          <img
            src="https://cdn.openart.ai/published/SHsFC7RezIOFQ4NmmGTh/aLgqS4rP_1UdL_512.webp" // Replace with an actual profile picture URL
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover mb-4"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Samantha Jones</h2>
        <p className="text-sm text-gray-600">samanthajones@gmail.com</p>
        <div className="flex justify-around mt-4 text-gray-800">
          <div>
            <h3 className="text-lg font-bold">5/6/2023</h3>
            <p className="text-xs">Joing Date</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">43</h3>
            <p className="text-xs">journals</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">21</h3>
            <p className="text-xs">Likes</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-900 transition">
            Edit
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
