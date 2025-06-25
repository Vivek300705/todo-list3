import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link

function Signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `http://localhost:8000/api/signup`,
        {
          username: formData.fullname, // Map fullname to username
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setSuccess("Account created successfully! Redirecting to log in...");
        setTimeout(() => {
          navigate("/signin"); // Redirect to sign-in page
        }, 1500);
        setFormData({ fullname: "", email: "", password: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-56228.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 bg-opacity-90">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="block border border-gray-300 w-full p-3 rounded mb-4"
            name="fullname" // Corrected name to match state key
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="block border border-gray-300 w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="block border border-gray-300 w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-700 focus:outline-none my-1"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            className="no-underline border-b border-blue-400 text-blue-500 hover:underline hover:text-blue-700"
            to="/signin"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
