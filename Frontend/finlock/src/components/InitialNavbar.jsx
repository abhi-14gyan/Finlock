import React from "react";
import logo from "../assets/Finlocklogo.png"; 
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <nav className="w-full px-6 py-4 bg-gray-300 dark:bg-gray-900 shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div onClick={() => navigate("/")} className="flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
          <img src={logo} alt="Finlock Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-black dark:text-white">
            Finlock
          </span>
        </div>

        <div className="hidden md:flex space-x-6 text-gray-800 dark:text-gray-200">
          <a href="/" className="hover:underline">Home</a>
        </div>

        <button
          onClick={toggleTheme}
          className="text-2xl text-black dark:text-white focus:outline-none"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
