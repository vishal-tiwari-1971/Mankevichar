import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRequestOTP = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, { email }
      );
      setMessage(response.data.message);

      // Redirect to Reset Password page and pass the email as state
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.log(error);
      if (error.response?.status === 404) {
        setMessage("Email not found. Please register.");
        return;
      }
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 mb-4 w-80 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white placeholder-gray-800 dark:placeholder-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleRequestOTP}
      >
        Request OTP
      </button>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div> 
    </>
  );
}

export default ForgotPassword;
