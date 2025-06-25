import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Use /signin endpoint to match your backend route
      const response = await API.post("/signin", {
        username: username.trim(),
        password: password
      });

      console.log("Login response:", response.data); // Debug log

      if (response.data && response.data.status === true) {
        // Store the access token in localStorage
        if (response.data.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
        } else if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }

        // Store user info if available
        if (response.data.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }

        setSuccess(response.data.message || "Login successful");

        // Small delay to show success message
        setTimeout(() => {
          navigate("/");
          // Consider using a state management solution instead of reload
          window.location.reload();
        }, 1000);

      } else {
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Enhanced error handling
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Please check your input");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-56228.jpg)"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 bg-opacity-90">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sign In</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <input
              type="text"
              className="block border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              name="username"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              className="block border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-center py-3 rounded-md text-white font-semibold transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            className="text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors duration-200"
            href="/signup"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signin;