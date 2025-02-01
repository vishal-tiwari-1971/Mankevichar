import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import SignInWithGoogle from "./SignInWithGoogle";

const Signup = () => {
  const [userName, setuserName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  const navigate = useNavigate();

  // Validate password (optional: you can make this stricter)
  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const submitData = async () => {

    // Basic validation for frontend fields
    if (!userName || !userEmail || !userPassword) {
    

      setErrorMessage("All fields are required.");
      return;
    }

    if (!validatePassword(userPassword)) {
      setErrorMessage(
        "Password must be at least 6 characters long, with at least one letter and one number."
      );
      return;
    }

    const data = {
      name: userName,
      email: userEmail,
      password: userPassword,
    };

    try {
     
      const signupResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data);

      if (signupResponse.status === 201) {
        // Redirect to OTP verification page
        navigate("/verify-otp", { state: { email: userEmail, password: userPassword } });
      }
    } catch (error) {
      console.error("Signup error:", error.response || error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear error message before submitting
    submitData();
  };

  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              {/* Display error message */}
              {errorMessage && (
                <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg mb-4 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v2m0 4v.01M6 3h12c1.1 0 1.99.9 1.99 2L20 19c0 1.1-.9 2-1.99 2H4c-1.1 0-1.99-.9-1.99-2L4 5c0-1.1.9-2 1.99-2z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="Name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userName}
                    onChange={(event) => setuserName(event.target.value)}
                    required
                  />
                </div>
               
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userEmail}
                    onChange={(event) => setuserEmail(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userPassword}
                    onChange={(event) => setuserPassword(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
                <SignInWithGoogle/>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
