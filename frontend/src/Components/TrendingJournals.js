import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

const TrendingJournal = () => {
  const [journalList, setJournalList] = useState([]);
  const [likedJournals, setLikedJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getJournals = async () => {
      try {
        const response = await axios.get("/journal/entries");
        setJournalList(response.data);
      } catch (error) {
        setError(error.message);
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
        alert("Please log in to like a journal.");
        return;
      }

      const { data } = await axios.post(
        `/journal/${journalId}/like`,
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

  // Handle loading and error states
  if (loading) return <Spinner />;
  if (error) return <div>Error occurred</div>;

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex justify-center">
        <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white font-serif">
          Trending Diaries
        </h2>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:bg-gray-900">
          {journalList.map((journal) => (
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
                {journal.content}
              </p>
              <div className="flex justify-between items-center">
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
                </span>
                <button>
                  <Link to={`/journal/entry/${journal._id}`}>Read More</Link>{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingJournal;
