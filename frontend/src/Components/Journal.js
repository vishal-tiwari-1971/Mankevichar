// JournalPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Spinner from './Spinner';

const Journal=()=> {
  const { id } = useParams();
  console.log("Journal ID:", id);
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific journal by ID from your backend API
    const getJournal = async () => {
      try {
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/journal/entry/${id}`);
        console.log("data is : ",response.data)
        setJournal(response.data);
      } catch (error) {
        console.error("Error fetching journal:", error);
      } finally {
        setLoading(false);
      }
    };

    getJournal();
  }, [id]);

  if (loading) return <Spinner />;
  if (!journal) return <div>Journal not found</div>;

  return (
   
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{journal.title}</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{journal.content}</p>
              {journal.image && (
                <img
                  src={journal.image}
                  alt={journal.title}
                  className="w-full h-auto object-cover rounded-lg mb-6"
                />
              )}
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">Posted on: {new Date(journal.createdAt).toLocaleDateString()}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">By User {journal.userId}</span>
              </div>
            </div>
          </div>
        </div>      
  );
}

export default Journal;