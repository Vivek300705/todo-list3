import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Check if token is in localStorage
    if (token) {
      setIsLoggedIn(true); // Set logged-in state if token exists
    }
  }, []); // Run only once when the component mounts

  const handleMakeTodoList = () => {
    navigate("/todo"); // Redirect to the To-Do page
  };

  return (
    <div className="text-center h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-56228.jpg)"
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-50  z-0"></div>
      
      <div className="relative z-10 text-white p-8 bg-white bg-opacity-20 rounded-lg shadow-xl  mx-4">
        <h1 className="font-bold text-4xl mb-6">Plan. Achieve. Simplify.</h1>
        <b>
          &quot; Organize your day, achieve your goals, and stay productive—your <br /> ultimate To-Do list starts here for a better tomorrow! &quot;
        </b>
        <p className="text-lg mt-4 font-medium">
          &quot; अपना दिन व्यवस्थित करें, अपने लक्ष्यों को पूरा करें, और उत्पादक बने रहें—बेहतर कल के लिए यहां से शुरुआत करें! &quot;
        </p>
      </div>

      {isLoggedIn && ( // Conditionally render the button based on login status
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleMakeTodoList}
        >
          Make Todolist
        </button>
      )}
    </div>
  );
}

export default Home;
