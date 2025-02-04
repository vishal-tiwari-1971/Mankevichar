import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate ,useParams} from 'react-router-dom';

const EditProfilePage = () => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   password: '',
  // });
  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);
  // const navigate = useNavigate();

  // const { id } = useParams();
  //     console.log("user id : ", id);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);
  
  //   if (!id) {
  //     setError('User ID is missing.');
  //     return;
  //   }
  
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     if (!token) {
  //       navigate('/login'); // Redirect to login if not authenticated
  //       return;
  //     }
  
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     };
       
  //     const { data } = await axios.put(`/user/edit/${id}`, formData, config);
  //     console.log("Sent id :",id);
      
  //     setSuccess(data.message || 'Profile updated successfully!');
  //     setTimeout(() => {
  //       navigate("/profile"); // Redirect after 2 seconds
  //     }, 1000);
  //   } catch (error) {
  //     setError(error.response?.data?.message || 'Error updating profile');
  //   }
  // };
  
  
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
   const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // For success message
    const navigate = useNavigate();
  
    const { id } = useParams();
    console.log("User Id : ", id);
  
    useEffect(() => {
      const userById = async () => {
        try {

          // const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`);
          const config = {
            headers: {
             Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          };
         ;
  
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, config);
  

          // console.log(response.data);
          // const result = response.data;
          setName(data.name);
          setPassword(data.password);
           } catch (error) {
          console.error("Error fetching user details:", error);
          setError("An error occurred while fetching user details.");
        }
      };
  
      userById();
    }, [id]);
  
    const submitData = async () => {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        
  

        const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/edit/${id}`, formData, {

          headers: {
            withCredentials: true, // Ensures cookies are sent with the request
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
  
        if (response.status === 200) {
          setSuccess("User profile updated successfully!");
          setTimeout(() => {
            navigate("/profile"); // Redirect after 2 seconds
          }, 2000);
        } else {
          setError("Failed to update the user profile.");
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        setError("An error occurred while updating the user.");
      }
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      submitData();
      // Reset form fields after submission
      setName("");
      setPassword("");
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
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                type="text"
                
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
