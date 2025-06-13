import React from "react";
import logo from "../assets/Finlocklogo.png"; // Ensure this path is correct
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function LandingNav() {
  const { user, checkingAuth } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="w-full px-6 py-4 bg-gray-900 shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo + Name */}
        <div onClick={()=>navigate("/")} className="flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer">
          <img src={logo} alt="Finlock Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white" >
            Finlock
          </span>
        </div>

        {/* Right Side: Links + Theme Toggle */}
        <div className="flex items-center space-x-6">
          <a
            href="/features"
            className="text-gray-200 hover:underline"
          >
            Features
          </a>
          <a
            href="/contact"
            className="text-gray-200 hover:underline"
          >
            Contact
          </a>
          <a
            href="/signin"
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            {(user? "Dashboard" : "Login")}
          </a>
        </div>
      </div>
    </nav>
  );
}
