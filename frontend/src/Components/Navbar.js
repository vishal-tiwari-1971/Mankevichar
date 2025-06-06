import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // If there's no user preference in localStorage, use the system theme
    if (localStorage.getItem("darkMode") === null) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e) => {
        setDarkMode(e.matches);
      };
      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex gap-5 items-center">
          <img 
            src={darkMode ? '/images/logo-1.png' : 'images/logo-light.jpg'} 
            className="h-[90px]" alt="MKV Logo"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-white"
          aria-controls="navbar-default"
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zM3 10h14a1 1 0 110 2H3a1 1 0 110-2zM3 15h14a1 1 0 110 2H3a1 1 0 110-2z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Navbar Links */}
        <div
          className={`fixed inset-0 z-10 bg-gray-100 dark:bg-gray-900  bg-opacity-95 transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0 md:bg-transparent`}
          id="navbar-default"
        >
          {/* Close Button */}
          {isOpen && (
            <button
              onClick={closeMenu}
              className="absolute top-4 left-4 text-black dark:text-white text-2xl"
            >
              ✖
            </button>
          )}

          {/* Menu Links */}
          <ul className="font-medium flex flex-col items-center mt-16 space-y-4 md:flex-row md:space-y-0 md:space-x-8 md:mt-0">
            <li>
              <Link
                to="/"
                className="text-black dark:text-white hover:text-blue-500"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className="text-black dark:text-white hover:text-blue-500"
                onClick={closeMenu}
              >
                Create Diary
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-black dark:text-white hover:text-blue-500"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-black dark:text-white hover:text-blue-500"
                onClick={closeMenu}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="text-black dark:text-white hover:text-blue-500"
                onClick={closeMenu}
              >
                Support Us
              </Link>
            </li>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="text-lg text-gray-900 dark:text-white hover:text-gray-600"
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

