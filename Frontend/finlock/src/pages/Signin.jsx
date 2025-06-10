import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/InitialNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';


export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const { user, checkingAuth } = useAuth();

  useEffect(() => {
  if (!checkingAuth && user) {
    toast.success("Already Logged In!");
    navigate("/dashboard");
  }
}, [checkingAuth, user, navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/v1/users/login", { email, password });
      setUser(response.data.data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
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
    if(user){
      toast.success("Already Signed in");
    }
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  const handleSignUpRedirect = () => {
    navigate("/register");
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
      divider: 'border-slate-300',
      dividerBg: 'bg-white'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <>
      <Navbar />

      <div className={`min-h-screen ${currentTheme.background} pt-28 relative`}>
        {/* Decorative Orbs */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className={`absolute top-10 left-10 w-72 h-72 ${currentTheme.decorativeOrbs.first} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
          <div className={`absolute top-40 right-10 w-72 h-72 ${currentTheme.decorativeOrbs.second} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
          <div className={`absolute bottom-0 left-1/3 w-72 h-72 ${currentTheme.decorativeOrbs.third} rounded-full mix-blend-multiply filter blur-2xl animate-pulse`} />
        </div>

        {/* SignIn Form */}
        <div className="relative z-10 flex justify-center items-center px-4">
          <div className="w-full max-w-md">
            <div className={`${currentTheme.card} backdrop-blur-xl rounded-2xl p-8 shadow-2xl border`}>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-lg" />
                </div>
                <h1 className={`${currentTheme.text.primary} text-2xl font-bold mb-2`}>Sign In</h1>
                <p className={`${currentTheme.text.secondary} text-sm`}>Welcome back! Please login to your account.</p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className={`block ${currentTheme.text.primary} text-sm font-medium mb-2`}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 ${currentTheme.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className={`block ${currentTheme.text.primary} text-sm font-medium mb-2`}>Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 ${currentTheme.input} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="text-right">
                  <button className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200">Forgot password?</button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-transform duration-200 transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : 'Login'}
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
                  Login with Google
                </button>

                {/* Sign Up Redirect */}
                <div className="text-center">
                  <p className={`${currentTheme.text.secondary} text-sm`}>
                    Don’t have an account?{' '}
                    <button onClick={handleSignUpRedirect} className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors duration-200">
                      Sign Up
                    </button>
                  </p>
                </div>

                <div className={`mt-8 pt-6 border-t ${currentTheme.divider}`}>
                  <p className={`text-center ${currentTheme.text.muted} text-xs`}>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
