import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

const TrendingJournal = () => {
  const [journalList, setJournalList] = useState([]);
  const [likedJournals, setLikedJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  
  useEffect(() => {
    const getJournals = async () => {
      try {

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/journal/entries`);

        console.log(response.data);
        setJournalList(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedJournals = () => {
      const storedLikedJournals =
        JSON.parse(localStorage.getItem("likedJournals")) || [];
      setLikedJournals(storedLikedJournals);
    };

    getJournals();
    fetchLikedJournals();
  }, []);

  // Handle like/unlike
  const toggleLike = async (journalId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("Please log in to like a journal.");
        return;
      }
       console.log(process.env.REACT_APP_API_URL);
       
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/journal/${journalId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update liked journals in state and localStorage
      const updatedLikedJournals = data.hasLiked
        ? [...likedJournals, journalId]
        : likedJournals.filter((id) => id !== journalId);

      // Update the liked journals state and store it in localStorage
      setLikedJournals(updatedLikedJournals);
      localStorage.setItem(
        "likedJournals",
        JSON.stringify(updatedLikedJournals)
      );

      // Update the like count for the journal
      setJournalList((prevJournalList) =>
        prevJournalList.map((journal) =>
          journal._id === journalId
            ? { ...journal, likeCount: data.likeCount }
            : journal
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setErrorMessage(null); // Hides the error message
  };

  // Handle loading and error states
  if (loading) return <Spinner />;

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between py-6 px-4">
        {errorMessage && (
          <div className="flex items-center p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-md relative">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l2 2m-2-2V6m0 8v4m0 0H8m4 0h4"
              ></path>
            </svg>
            <span>{errorMessage}</span>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCancel}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white font-serif">
          Trending Diaries
        </h2>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
          { Array.isArray(journalList) && journalList.length > 0 ? (
            [...journalList]
            .sort((a,b) => b.likeCount-a.likeCount) // sort journals by no. of like counts
          .map((journal) => (
            <div
              className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col"
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
              <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => toggleLike(journal._id)}>
                  {localStorage.getItem("authToken") &&
                  likedJournals.includes(journal._id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  )}
                </button>

                <span className="text-gray-400 dark:text-white">
                  {journal.likeCount}
                </span> </div>
                <button>
                  <Link to={`/journal/entry/${journal._id}`}>Read More</Link>{" "}
                </button>
              </div>
            </div>
            ))
           ) : (
              <p>No journals found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingJournal;
