import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
        
          navigate('/login');  // Redirect to login if not authenticated
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        };
        const { data } = await axios.get('/user/profile', config);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  
  const handleLogout = async () => {
      try {
          // Send a request to the backend to logout (clear token in cookies or session)
          await axios.post('/user/logout'); // Or use POST if you prefer
  
          // Clear the token from localStorage
          localStorage.removeItem('authToken');
  
          // Redirect user to the home or login page
          navigate('/'); // Or '/login' depending on where you want to redirect after logout
  
          // Optionally, display a success message or update UI (e.g., showing "Logged out")
      } catch (error) {
          console.error("Error during logout:", error);
          // Optionally handle errors gracefully, like showing an error message to the user
      }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }


  const formattedJoinDate = new Date(profile.joinDate).toLocaleDateString();

  return (
    <div className="dark:bg-gray-900">
      <Navbar />
      
      
      <div className="profile-container p-5 flex justify-center items-center">
        <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-10 text-center w-80">
          <h2 className="text-2xl font-semibold text-black">Your Profile</h2>
          <div className="flex justify-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture} // Show uploaded profile picture if available
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover mb-4"
              />
            ) : (
              <ProfilePicture name={profile.firstName || 'User'} />
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <div className="flex justify-around mt-4 text-gray-800">
            <div>
              <h3 className="text-lg font-bold">{formattedJoinDate}</h3>
              <p className="text-xs">Joining Date</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile.journals}</h3>
              <p className="text-xs">Journals</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile.likes}</h3>
              <p className="text-xs">Likes</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-900 transition">
              Edit
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
