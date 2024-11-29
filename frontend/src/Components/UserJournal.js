import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const UserJournal = () => {
  const [userJournal, setUserJournal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation to login/signup

  useEffect(() => {
    const fetchJournals = async () => {
      const token = localStorage.getItem("authToken"); // Check if token exists

      if (!token) {
        setError("You need to log in or sign up to access your journals.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/journal/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserJournal(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in.");
        } else {
          setError("An error occurred while fetching your journals.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this journal?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.delete(`/journal/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the deleted journal from the UI
        setUserJournal(userJournal.filter((journal) => journal._id !== id));
      } else {
        setError("An error occurred while deleting the journal.");
      }
    } catch (error) {
      setError("An error occurred while deleting the journal.");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="text-center">
        <h2>{error}</h2>
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (userJournal.length === 0) {
    return <h2>You haven't created any journals yet. Start writing your first journal now!</h2>;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Uploaded Journals</h2>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userJournal.map((journal) => (
            <div
              className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col"
              key={journal._id}
            >
              <div className="w-full h-48 mb-2 overflow-hidden">
                <img src={journal.image} alt={journal.title} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center text-white">
                {journal.title}
              </h3>
              <p className="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">
                {journal.content}
              </p>
              <div className="flex space-x-2 mt-4">
                <Link to={`/update/${journal._id}`}>
                  <button className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">
                    Update
                  </button>
                </Link>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(journal._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserJournal;
