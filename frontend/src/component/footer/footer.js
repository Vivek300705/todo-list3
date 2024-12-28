import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 bottom-0 w-full">
      <div className="flex justify-center items-center space-x-2">
        <span className="font-bold">ToDos</span>
        <span>&copy;</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

export default Footer;
