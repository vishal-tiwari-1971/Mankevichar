import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate ,useParams} from 'react-router-dom';

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
      console.log("user id : ", id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (!id) {
      setError('User ID is missing.');
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.put(`/user/edit/${id}`, formData, config);
      console.log("Sent id :",id);
      
      setSuccess(data.message || 'Profile updated successfully!');
      setTimeout(() => {
        navigate("/profile"); // Redirect after 2 seconds
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };
  

  return (
    <div className="dark:bg-gray-900">
      <Navbar />
      <div className="edit-profile-container p-5 flex justify-center items-center">
        <div className="bg-white shadow dark:border rounded-lg p-10 dark:bg-gray-800 dark:border-gray-700 text-center w-80">
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div>
              <button
                type="submit"
               
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-900 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profile`)}
                className="mt-2 bg-gray-500 text-white py-2 px-4 rounded-md w-full hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
