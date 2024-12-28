import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import dotenv from 'dotenv';
// dotenv.config();

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("No token found. Please sign in again.");
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setUserProfile(response.data.profile); // Set the user profile data
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-grey-lighter min-h-screen flex flex-col items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-56228.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 container mx-auto flex flex-row gap-6 py-4 px-2">
        {/* Profile Box */}
        <div className="flex-1 bg-white p-6 justify-center rounded-md shadow-md bg-opacity-30">
          <h2 className="text-xl font-medium flex justify-center mb-4">Your Profile</h2>

          {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}

          {userProfile && (
            <div className="profile-details text-center">
              <img
                src="https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
                alt="Profile Avatar"
                className="rounded-full w-24 h-24 mx-auto mb-4"
              />
              <h2 className="text-xl mb-4">Welcome, {userProfile.username}</h2>
              <div className="mb-4">
                <strong>Email:</strong> {userProfile.email}
              </div>
              <div className="mb-4">
                <strong>Created At:</strong> {new Date(userProfile.createdAt).toLocaleDateString()}
              </div>

              {/* Logout Button */}
              <button
                className="w-full text-center py-3 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none my-4"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  navigate("/signin");
                  window.location.reload(); // To reload the page with new access token
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
