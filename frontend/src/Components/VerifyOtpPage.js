import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useBackendUrl } from "../Components/BackendContext"
const backendUrl = useBackendUrl();

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email;
  const password = location.state?.password;

  if (!email) {
    navigate("/signup");
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const authToken = localStorage.getItem('authToken');


    try {
      const response = await axios.post(`${backendUrl}/user/verify-otp`, { email, otp }, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}` // Include token if necessary
        }
      });

      if (response.status === 200) {
        const loginData = { email, password };
        const loginResponse = await axios.post(`${backendUrl}/user/login`, loginData);

        localStorage.setItem("authToken", loginResponse.data.token);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage("Invalid OTP. Please try again.");
            break;
          case 410:
            setErrorMessage("OTP has expired. Please request a new one.");
            break;
          case 500:
            setErrorMessage("Server error. Please try again later.");
            break;
          default:
            setErrorMessage(
              error.response.data.message || "An error occurred."
            );
        }
      } else {
        setErrorMessage("An error occurred while connecting to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify Your Account
              </h1>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerifyOtpPage;
