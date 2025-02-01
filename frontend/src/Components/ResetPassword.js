import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function ResetPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword) {
      setMessage("All fields are required.");
      return;
    }

    console.log("Reset Password Request for Email:", email);
    try {
      const response = await axios.post(
        `/user/reset-password`,
        { email, otp: otp.trim(), newPassword }
      );
      setMessage(response.data);
      setTimeout(() => navigate("/login"), 2000);
      
    } catch (error) {
      console.log(error);
      
      console.error("Error in Reset Password:", error.response?.data || error);
      setMessage(error.response?.data || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 mb-4 w-80 rounded-md"
        value={email}
        readOnly
      />
      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 mb-4 w-80 rounded-md"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter new password"
        className="border p-2 mb-4 w-80 rounded-md"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={handleResetPassword}
      >
        Reset Password
      </button>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

export default ResetPassword;
