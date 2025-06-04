import React, { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('m@example.com');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Email:', email, 'Password:', password);
  };

  const handleGoogleLogin = () => {
    // Handle Google login here
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg p-8 shadow-2xl border border-gray-700">
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
            <button className="text-white text-sm hover:underline">
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="m@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-white text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-blue-400 text-sm hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-200 hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Login
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
  );
}