import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/InitialNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { user, checkingAuth } = useAuth();

  useEffect(() => {
    if (!checkingAuth && user) {
      toast.success("Already Logged In!");
      navigate("/dashboard");
    }
  }, [checkingAuth, user, navigate]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { username, email, password, image } = formData;

    if (!username || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      if (image) data.append("imageUrl", image);

      const response = await axios.post("/api/v1/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful! Redirecting to login...");
      navigate("/signin");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already registered. Please login.");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error("Invalid data. Please check your inputs.");
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleGoogleLogin = () => {
    if (user) {
      toast.success("Already Signed in");
    }
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };


  const themeStyles = {
    dark: {
      background: 'bg-[#0F0E17]',
      card: 'bg-[#1A1A2E]/90 border-[#2E2E3A]/50',
      input: 'bg-[#20202E] border-[#2E2E3A] text-white placeholder-gray-500 focus:ring-violet-500',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-400',
        muted: 'text-gray-500'
      },
      decorativeOrbs: {
        first: 'bg-violet-600/30',
        second: 'bg-pink-600/30',
        third: 'bg-indigo-600/30'
      },
      profileBg: 'bg-[#2A2A3A]',
      divider: 'border-[#2E2E3A]',
      dividerBg: 'bg-[#1A1A2E]'
    },
    light: {
      background: 'bg-gradient-to-br from-white via-slate-500 to-white',
      card: 'bg-white/80 border-slate-200/70',
      input: 'bg-slate-50 border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        muted: 'text-gray-500'
      },
      decorativeOrbs: {
        first: 'bg-purple-200/30',
        second: 'bg-pink-200/30',
        third: 'bg-blue-200/30'
      },
      profileBg: 'bg-slate-200',
      divider: 'border-slate-300',
      dividerBg: 'bg-white'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background} relative`}>
      {/* Navbar */}
      <Navbar />

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 ${currentTheme.decorativeOrbs.first} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
        <div className={`absolute top-40 right-10 w-72 h-72 ${currentTheme.decorativeOrbs.second} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
        <div className={`absolute -bottom-8 left-20 w-72 h-72 ${currentTheme.decorativeOrbs.third} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
      </div>

      {/* Register Card */}
      <div className="relative z-10 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className={`${currentTheme.card} backdrop-blur-xl rounded-2xl p-8 shadow-2xl border`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg" />
              </div>
              <h1 className={`${currentTheme.text.primary} text-2xl font-bold mb-2`}>Create Account</h1>
              <p className={`${currentTheme.text.secondary} text-sm`}>Join us today and start your journey</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 mx-auto mb-3 shadow-md">
                    <div className={`w-full h-full rounded-full ${currentTheme.profileBg} flex items-center justify-center overflow-hidden`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className={`w-8 h-8 ${currentTheme.text.secondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className={`${currentTheme.text.secondary} text-xs`}>Click to upload profile picture (optional)</p>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className={`block ${currentTheme.text.primary} text-sm font-medium mb-2`}>Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${currentTheme.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block ${currentTheme.text.primary} text-sm font-medium mb-2`}>Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${currentTheme.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={`block ${currentTheme.text.primary} text-sm font-medium mb-2`}>Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${currentTheme.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Register Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-transform duration-200 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${currentTheme.divider}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${currentTheme.dividerBg} ${currentTheme.text.secondary}`}>or</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md border border-gray-600 transition-colors duration-200"
              >
                Continue with Google
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className={`${currentTheme.text.secondary} text-sm`}>
                  Already have an account?{' '}
                  <button onClick={handleSignIn} className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors duration-200">
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-8 pt-6 border-t ${currentTheme.divider}`}>
              <p className={`text-center ${currentTheme.text.muted} text-xs`}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
