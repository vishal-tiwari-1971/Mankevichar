import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import UserJournal from './UserJournal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [likedJournals, setLikedJournals] = useState([]);
  const [error, setError] = useState("");  // For storing error messages
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Auth Token:', token);
    if (!token) {
      navigate('/login');
    }

    const fetchLikedJournals = async () => {
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/liked-journals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedJournals(response.data);

        if(response.data==null){
          // response.status(200)("You haven't liked any journals yet")
        }

      } catch (error) {
        setError("Failed to fetch liked journals. Please try again later.");  // Setting error message for UI
        console.error('Error fetching liked journals:', error);
      }
    };

    fetchLikedJournals();
  }, [navigate]);

  return (
    <div className="dark:bg-gray-900 text-white">
      <Navbar />
      <div className="dashboard-container p-6">
        <section>
          <UserJournal />
        </section>

        {/* Liked Journals Section */}
        <section className="bg-white dark:bg-gray-900 mt-8">
          <div className="flex justify-center">
            <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white font-serif">
              Liked Diaries
            </h2>
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
              {error && (
                <p className="text-center text-xl text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
              {likedJournals.length > 0 ? (
                likedJournals.map((journal) => (
                  <div
                    className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col"
                    key={journal._id}
                  >
                    <div className="w-full h-48 mb-2 overflow-hidden">
                      {journal.image ? (
                        <img
                          className="w-full h-full object-contain object-center"
                          src={journal.image}
                          alt={journal.title}
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src={`https://placehold.co/800?text=${journal.title}&font=roboto`}
                          className="w-full h-full object-contain object-center"
                          alt={journal.title}
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-center dark:text-white text-gray-700">
                      {journal.title}
                    </h3>
                    <p className="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">
                    {journal.content.length > 100 
    ? `${journal.content.slice(0, 100)}...` 
    : journal.content}
                    </p>
                    <div className="flex justify-end items-center">
                      <button>
                        <a href={`${process.env.REACT_APP_API_URL}/journal/entry/${journal._id}`}>Read More</a>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <h2 className="text-center text-xl text-gray-600 dark:text-gray-300">
                  You haven't liked any journals yet.
                </h2>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
