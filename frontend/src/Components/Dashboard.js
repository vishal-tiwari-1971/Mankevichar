import React from 'react';
import Navbar from './Navbar';
import UserJournal from './UserJournal';

const Dashboard = () => {
 
  return(
    <div>
       <div class="dark:bg-gray-900 text-white">
    <Navbar/>
    <div className="dashboard-container p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Dashboard</h1>
      <section>
     <UserJournal/>
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
     </div>
     </div> 
     </div>
  )
};

export default Dashboard;