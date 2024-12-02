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
      <div className="flex flex-col items-center  h-screen ">
  <h1 className="text-2xl  font-semibold dark:text-white mt-[15%]">
    {"You need to log in or sign up to continue."}
  </h1>

  <div className=" flex space-x-4 mt-5">
    <button
      className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition-all"
      onClick={() => navigate('/Login')}
    >
      Login
    </button>
    <button
      className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md font-medium transition-all"
      onClick={() => navigate('/Signup')}
    >
      Sign Up
    </button>
  </div>
</div>

    )
  }

  if (userJournal.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl pb-3 font-bold text-gray-900 dark:text-white">
          No journals found. Please upload a journal to view it here.
        </h1>
        <button
          className="px-6 py-3 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition-all"
          onClick={() => navigate('/Create')}
        >
          Create Journal
        </button>
      </div>
    );
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
