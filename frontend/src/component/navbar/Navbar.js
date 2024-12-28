import React, { useState, useEffect } from "react";
import { GiWhiteBook } from "react-icons/gi";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks if the user is logged in
  const navigate = useNavigate();

  // Check if user is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Check if token is in localStorage
    if (token) {
      setIsLoggedIn(true); // Set logged-in state if token exists
    }
  }, []); // Empty dependency array to run this only on mount

  // Handlers for navigation and state updates
  const handleLogout = () => {
    setIsLoggedIn(false); // Update state to logged out
    localStorage.removeItem("accessToken"); // Remove token from localStorage
    navigate("/"); // Redirect to home page
    window.location.reload(); // Reload the page to update state
  };

  const handleSignUp = () => {
    navigate("/signup"); // Redirect to signup page
  };

  const handleSignIn = () => {
    navigate("/signin"); // Redirect to signin page
  };

  return (
    <div className="bg-gray-800 text-white">
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <a href="/" className="text-lg font-bold flex items-center">
            <GiWhiteBook className="text-2xl mr-2" />
            ToDos
          </a>
        </div>

        {/* Toggle Button for Mobile Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block md:hidden text-white focus:outline-none"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Navbar Links */}
        <div
          className={`${menuOpen ? "block" : "hidden"
            } md:flex md:space-x-4 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent z-10 transition-all duration-300 ease-in-out ${menuOpen ? "top-16" : "-top-full"
            }`}
        >
          <a
            href="/"
            className="block md:inline-block hover:text-gray-300 text-white px-3 py-2 rounded-lg text-center"
          >
            Home
          </a>

          <a
            href="/Aboutus"
            className="block md:inline-block hover:text-gray-300 text-white px-3 py-2 rounded-lg text-center"
          >
            About Us
          </a>

          {/* Conditional Rendering of Auth Links */}
          {!isLoggedIn && (
            <div
              className={`flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center`}
            >
              <button
                onClick={handleSignUp}
                className="block hover:text-gray-300 text-white px-3 py-2 rounded-lg text-center"
              >
                SignUp
              </button>
              <button
                onClick={handleSignIn}
                className="block hover:text-gray-300 text-white px-3 py-2 rounded-lg text-center"
              >
                SignIn
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div
              className={`flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center`}
            >
              <button
                onClick={handleLogout}
                className="block hover:text-gray-300 text-white px-3 py-2 rounded-lg text-center"
              >
                Logout
              </button>
              <a
                href="/profile"
                className="block md:inline-block w-10 h-10 mx-auto md:mx-0 text-center"
              >
                <img
                  className="rounded-full border border-gray-300 shadow-sm"
                  src="https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
                  alt="user"
                />
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
