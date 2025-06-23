import React, { useState } from "react";
import logo from "../assets/Finlocklogo.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function LandingNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 bg-gray-900 shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 hover:scale-105 transition-transform cursor-pointer"
        >
          <img src={logo} alt="Finlock Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">Finlock</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/features" className="text-gray-200 hover:underline">
            Features
          </a>
          <a href="/contact" className="text-gray-200 hover:underline">
            Contact
          </a>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/signin")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {user ? "Dashboard" : "Login"}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md bg-gray-800"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mt-4 md:hidden flex flex-col space-y-4 items-start px-4">
          <a
            href="/features"
            className="text-gray-200 hover:underline w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="/contact"
            className="text-gray-200 hover:underline w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
          <button
            onClick={() => {
              navigate(user ? "/dashboard" : "/signin");
              setMobileMenuOpen(false);
            }}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {user ? "Dashboard" : "Login"}
          </button>
        </div>
      )}
    </nav>
  );
}
