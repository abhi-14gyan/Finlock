import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/InitialNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const [email, setEmail] = useState('m@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info("Email not registered. Redirecting to Sign Up...");
        navigate("/register");
      } else if (error.response?.status === 401) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  const handleSignUpRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-white transition-colors duration-300">
      <Navbar />

      {/* Form Container */}
      <div className="flex items-center justify-center p-20">
        <div className="w-full max-w-md">
          <div className="bg-gray-700 rounded-lg p-8 shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-white text-xl font-semibold mb-2">
                  Login to your account
                </h1>
                <p className="text-gray-400 text-sm">
                  Enter your email below to login to your account
                </p>
              </div>
              <button onClick={handleSignUpRedirect} className="text-white text-sm hover:underline">
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="m@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-white text-sm font-medium">
                    Password
                  </label>
                  <button type="button" className="text-blue-400 text-sm hover:underline">
                    Forgot your password?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Login Button with Spinner */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  "Login"
                )}
              </button>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md border border-gray-600 transition-colors duration-200"
              >
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
