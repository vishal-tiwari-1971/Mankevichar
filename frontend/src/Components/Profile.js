import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import Spinner from './Spinner';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("Auth Token:",token);
    const fetchProfile = async () => {
      try {

        if (!token) {
          navigate('/login'); // Redirect to login if not authenticated
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        };
       ;
        const { data } = await axios.get(`https://mankevichar-preshivishal.vercel.app/user/profile`, config);
        console.log('Profile Data:', data);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error.response || error.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`https://mankevichar-preshivishal.vercel.app/user/logout`, {}, config);
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (error) {
      
      console.error('Error during logout:', error);
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return navigate('/login')
    ;

  const formattedJoinDate = profile?.joinDate
    ? new Date(profile.joinDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not Available';

  return (
    <div className="dark:bg-gray-900">
      <Navbar />
      <div className="profile-container p-5 flex justify-center items-center">
        <div className="bg-white shadow dark:border rounded-lg p-10 dark:bg-gray-800 dark:border-gray-700 text-center w-80">
          <h2 className="text-2xl font-semibold text-white">Your Profile</h2>
          <div className="flex justify-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover mb-4"
              />
            ) : (
              <ProfilePicture name={profile?.name || 'User'} />
            )}
          </div>

          <h2 className="text-xl font-bold text-white">
            {profile?.name || 'Guest'}
          </h2>
          <p className="text-sm text-white">{profile?.email || 'Not Available'}</p>
          <div className="flex justify-around mt-4 text-white">
            <div>
              <h3 className="text-lg font-bold">{formattedJoinDate}</h3>
              <p className="text-xs">Joining Date</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile?.journals || 0}</h3>
              <p className="text-xs">Journals</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile?.likedJournals || 0}</h3>
              <p className="text-xs">Likes</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                console.log('Navigating to Edit Profile with ID:', profile?._id || profile?.id);
                navigate(`/user/edit/${profile?._id || profile?.id}`);
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-900 transition"
            >
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
