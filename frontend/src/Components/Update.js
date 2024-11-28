import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
const Update = () => {
  // to store values from frontend
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null); // Reference for clearing file input
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Journal Id : ", id);

  //   useEffect(() => {
  //     const token = localStorage.getItem("authToken");  // Assuming token is stored in localStorage
  //     // if (!token) {
  //     //   // Redirect to login if the user is not logged in
  //     //   navigate("/login");
  //     // }
  //   }, [navigate]);
  useEffect(() => {
    const entryById = async () => {
      try {
        const response = await axios.get(`/journal/entry/${id}`);
        console.log(response.data);

        if (response.ok) {
          //   const result = await response.json();
          const result = response.data;
          setTitle(result.title);
          setContent(result.content);
          setVisibility(result.visibility);
        } else {
          setErrorMessage("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setErrorMessage("An error occurred while fetching product details.");
      }
    };
    entryById();
  }, [id]);
  // to send data
  const submitData = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("visibility", visibility);
    if (image) {
      formData.append("image", image); // Add image file
    }
    const response = await axios.put(`/journal/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Include the token in the headers (if available)
        // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    console.log(response);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // submit data
    submitData();
    setTitle("");
    setContent("");
    setVisibility("private");
    setImage(null);
    // Reset file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <body class="bg-white dark:bg-gray-900">
      <Navbar />
      <form class="max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div class="mb-5">
          <label
            for="content"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <textarea
            id="content"
            rows="7"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
        </div>
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="file_input"
        >
          Upload Image
        </label>
        <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          onChange={(event) => setImage(event.target.files[0])}
        />
        <p
          class="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          PNG, JPG or JPEG (MAX. 2 MB).
        </p>
        {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Visibility:
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </label> */}
        <fieldset className="block mb-3 mt-3 text-sm font-medium text-gray-900 dark:text-white">
          <legend className="mb-2">Visibility:</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === "private"}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio text-indigo-600 focus:ring focus:ring-indigo-500"
              />
              <span>Private</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === "public"}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio text-indigo-600 focus:ring focus:ring-indigo-500"
              />
              <span>Public</span>
            </label>
          </div>
        </fieldset>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Diary
        </button>
      </form>
    </body>
  );
};
export default Update;
