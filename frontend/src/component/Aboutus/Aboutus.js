import React from "react";
import { FaEnvelope } from "react-icons/fa";

function AboutUs() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-56228.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-center lg:space-x-8 py-8 px-4 space-y-8 lg:space-y-0">
        {/* About Us Section */}
        <div className="bg-white p-8 rounded-md shadow-md bg-opacity-30 w-full max-w-lg">
          <h1 className="text-3xl text-center mb-4">About Us</h1>
          <p className="text-lg mb-6 text-center">
            Hi, I'm <strong>Vivek Kumar Sulaniya</strong>, and I created this website
            as my first full-stack project. It is designed to help users manage their
            tasks effectively with a simple and intuitive interface. The project
            showcases my skills in both frontend and backend development using a variety
            of technologies such as React, Node.js, and MongoDB.
          </p>
          <p className="text-lg mb-6 text-center">
            The goal of this project was to create a user-friendly experience while
            learning full-stack development. Every feature you see here has been crafted
            with attention to detail and a passion for creating functional, easy-to-use web
            applications.
          </p>
        </div>

        {/* Suggestion Box Section */}
        <div className="bg-white p-8 rounded-md shadow-md bg-opacity-30 w-full max-w-lg">
          <h2 className="text-2xl text-center mb-4">Send Us Your Suggestions</h2>
          <p className="text-lg mb-6 text-center">
            We would love to hear from you! If you have any suggestions or feedback, feel free to send them our way.
          </p>

          <form
            action="mailto:vivekkumarsulaniya@gmail.com"
            method="post"
            encType="text/plain"
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="border border-grey-light w-full p-3 rounded mb-4"
              required
            />
            <textarea
              name="body"
              placeholder="Your Suggestion"
              className="border border-grey-light w-full p-3 rounded mb-4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none"
            >
              <FaEnvelope className="inline mr-2" />
              Send Suggestion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
