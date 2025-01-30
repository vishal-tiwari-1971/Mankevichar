import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const CreateDiaryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Check if token exists
    console.log('Auth Token:', token); // Debug log
    if (!token) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const submitData = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('visibility', visibility);
    if (image) {
      formData.append('image', image); // Add image file
    }
    
    try {
      const response = await axios.post(`/journal/entries`, formData, {
        headers: {
          withCredentials: true, // Ensures cookies are sent with the request
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      console.log(response);
      // Reset form fields
      setTitle('');
      setContent('');
      setVisibility('private');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      navigate('/dashboard'); // Redirect to dashboard after submission
    } catch (error) {
      
      console.error('Error submitting data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitData();
  };



  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-white">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="block w-full p-2.5 mt-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-white">
            Content
          </label>
          <textarea
            id="content"
            rows="7"
            className="block w-full p-2.5 mt-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
        </div>

        <label htmlFor="file_input" className="block text-sm font-medium text-gray-900 dark:text-white">Upload Image</label>
        <input
          id="file_input"
          type="file"
          className="block w-full mt-2 text-sm border border-gray-300 rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
          onChange={(event) => setImage(event.target.files[0])}
        />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Visibility</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio"
              />
              <span>Private</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio"
              />
              <span>Public</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg py-2.5"
        >
          Submit Diary
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default CreateDiaryPage;
