import React from "react";
import { Link } from "react-router-dom";
import TrendingJournal from "./TrendingJournals";
import Navbar from "./Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />

      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start">
            <h1 className="max-w-2xl mb-4 text-3xl font-extrabold tracking-tight leading-tight md:text-5xl xl:text-6xl dark:text-white">
              Write, Reflect, and Share: A Simple Way to Keep Your Diary
            </h1>
            <p className="max-w-2xl mb-6 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Writing your thoughts has never been easier. Whether you're jotting down daily reflections or sharing longer stories with the world, our platform makes it simple to get started. Explore trending diaries from other users, create your own, and build a diary.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                Get started
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-5 py-3 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
            <img
              className="rounded-xl shadow-lg object-cover"
              src="https://images.pexels.com/photos/8035295/pexels-photo-8035295.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Diary Mockup"
            />
          </div>
        </div>
      </section>

      {/* Trending Journals */}
      <TrendingJournal />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="w-full mx-auto max-w-screen-xl p-4 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 <h4 className="inline font-bold">Man Ke Vichar™</h4>. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
