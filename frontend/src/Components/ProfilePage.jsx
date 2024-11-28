import React from "react";

const ProfilePage = () => {
  return (
    <div className="bg-navy-blue min-h-screen flex justify-center items-center">
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 text-center w-80">
        <div className="flex justify-center">
          <img
            src="https://cdn.openart.ai/published/SHsFC7RezIOFQ4NmmGTh/aLgqS4rP_1UdL_512.webp" // Replace with an actual profile picture URL
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover mb-4"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Samantha Jones</h2>
        <p className="text-sm text-gray-600">samanthajones@gmail.com</p>
        <div className="flex justify-around mt-4 text-gray-800">
          <div>
            <h3 className="text-lg font-bold">5/6/2023</h3>
            <p className="text-xs">Joing Date</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">43</h3>
            <p className="text-xs">journals</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">21</h3>
            <p className="text-xs">Likes</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button className="bg-navy-blue text-white py-2 px-4 rounded-md w-full hover:bg-blue-900 transition">
            Edit
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
