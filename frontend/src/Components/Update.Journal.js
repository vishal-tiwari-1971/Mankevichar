import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";



const Update = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  console.log("Journal Id : ", id);

  useEffect(() => {
    const entryById = async () => {
      try {
        const response = await axios.get(`/journal/entry/${id}`);
        console.log(response.data);
        const result = response.data;
        setTitle(result.title);
        setContent(result.content);
        setVisibility(result.visibility);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setErrorMessage("An error occurred while fetching journal details.");
      }
    };

    entryById();
  }, [id]);

  const submitData = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("visibility", visibility);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(`/journal/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Journal updated successfully!");
        setTimeout(() => {
          navigate("/dashboard"); // Redirect after 2 seconds
        }, 2000);
      } else {
        setErrorMessage("Failed to update the journal.");
      }
    } catch (error) {
      console.error("Error updating journal:", error);
      setErrorMessage("An error occurred while updating the journal.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitData();
    // Reset form fields after submission
    setTitle("");
    setContent("");
    setVisibility("private");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  return (
    <body className="bg-white dark:bg-gray-900">
      <Navbar />
      <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="mb-5 text-green-600 font-medium">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-5 text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="content"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <textarea
            id="content"
            rows="7"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
        </div>

        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload Image
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={(event) => setImage(event.target.files[0])}
          ref={fileInputRef}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          PNG, JPG or JPEG (MAX. 2 MB).
        </p>

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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Diary
        </button>
      </form>
    </body>
  );
};

export default Update;
