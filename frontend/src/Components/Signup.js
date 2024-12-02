import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";

const Signup = () => {
  const [userFirstName, setuserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
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
    if (!userFirstName || !userLastName || !userEmail || !userPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    if (!validatePassword(userPassword)) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    const data = {
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      password: userPassword,
    };

    // Debugging log
    console.log("Data being sent to the backend:", data); 

    try {
      // Send data to the backend for signup
      const signupResponse = await axios.post("/user/signup", data);

      // Now, log the user in immediately
      const loginData = {
        email: userEmail,
        password: userPassword,
      };

      const loginResponse = await axios.post("/user/login", loginData);

      // Store the token from the login response
      localStorage.setItem("authToken", loginResponse.data.token);

      // Log the login response for debugging
      console.log("Login response:", loginResponse);

      // If signup is successful, redirect the user to the OTP verification page
      if (signupResponse.status === 201) {
        navigate("/verify-otp", { state: { email: userEmail } });
      }
    } catch (error) {
      // Handle errors gracefully
      if (error.response) {
        // Backend error with a response (e.g., validation or server errors)
        console.error("Signup error:", error.response.data);
        setErrorMessage(error.response.data.message || "An error occurred during signup.");
      } else {
        // Network or other errors
        console.error("Error:", error.message);
        setErrorMessage("An error occurred while connecting to the server.");
      }
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
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div> // Display error messages
              )}
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userFirstName}
                    onChange={(event) => setuserFirstName(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userLastName}
                    onChange={(event) => setuserLastName(event.target.value)}
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
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
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
