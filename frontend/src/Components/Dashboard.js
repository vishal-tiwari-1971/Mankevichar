import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';  // Assuming you already have this Card component for journal display.
import Navbar from './Navbar';

const Dashboard = () => {
  const [uploadedJournals, setUploadedJournals] = useState([]);
  const [likedJournals, setLikedJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchJournals = async () => {
//       try {
//         // Fetch the user's uploaded journals
//         const uploadedResponse = await axios.get('journal/entries/:id');
//         setUploadedJournals(uploadedResponse.data);

//         // Fetch the user's liked journals
//         // const likedResponse = await axios.get('/api/journals/liked');
//         // setLikedJournals(likedResponse.data);
//       } catch (err) {
//         setError('Failed to load journals');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJournals();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

  return ( 
    <div class="dark:bg-gray-900 text-white">
    <Navbar/>
    <div className="dashboard-container p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Dashboard</h1>

      {/* Uploaded Journals Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Uploaded Journals</h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uploadedJournals.length > 0 ? (
            uploadedJournals.map((journal) => (
              <Card key={journal.id} journal={journal} />
            ))
          ) : (
            <p>No journals uploaded yet.</p>
          )}
        </div> */}
      </section>

      {/* Liked Journals Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Liked Journals</h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedJournals.length > 0 ? (
            likedJournals.map((journal) => (
              <Card key={journal.id} journal={journal} />
            ))
          ) : (
            <p>No liked journals yet.</p>
          )}
        </div> */}
      </section>
    </div> </div>
  );
};

export default Dashboard;
