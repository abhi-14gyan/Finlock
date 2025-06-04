import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Star, Zap, CreditCard, Globe, TrendingUp, Target, Scan, Clock } from 'lucide-react';

const NeoWealthLanding = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through activation protocol steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', color: 'from-blue-400 to-purple-500' },
    { icon: DollarSign, value: '$2B+', label: 'Transactions Tracked', color: 'from-yellow-400 to-orange-500' },
    { icon: Zap, value: '99.9%', label: 'Uptime', color: 'from-red-400 to-pink-500' },
    { icon: Star, value: '4.9/5', label: 'User Rating', color: 'from-green-400 to-teal-500' }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Quantum Analytics',
      description: 'Get detailed insights into your spending patterns with AI-powered analytics',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Scan,
      title: 'Neural Receipt Scanner',
      description: 'Extract data automatically from receipts using advanced AI technology',
      color: 'from-pink-400 to-purple-500'
    },
    {
      icon: Clock,
      title: 'Predictive Planning',
      description: 'Create and manage budgets with intelligent recommendations',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: CreditCard,
      title: 'Multi-Account Sync',
      description: 'Manage multiple accounts and credit cards in one unified interface',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Globe,
      title: 'Global Currency',
      description: 'Support for multiple currencies with real-time conversion rates',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Automated Insights',
      description: 'Get automated financial insights and recommendations instantly',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  const activationSteps = [
    {
      icon: CreditCard,
      title: 'Initialize Account',
      description: 'Get started in minutes with our secure quantum sign-up process',
      step: '01'
    },
    {
      icon: BarChart3,
      title: 'Sync Financial Data',
      description: 'Automatically categorize and track your transactions in real-time',
      step: '02'
    },
    {
      icon: Target,
      title: 'Receive AI Insights',
      description: 'Get AI-powered insights and recommendations to optimize your finances',
      step: '03'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      avatar: 'SJ',
      rating: 5,
      text: 'NeoWealth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      avatar: 'MC',
      rating: 5,
      text: 'The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Financial Advisor',
      avatar: 'ER',
      rating: 5,
      text: 'I recommend NeoWealth to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.',
      color: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">NeoWealth</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Testimonials</a>
          <button className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 mr-2 text-cyan-400" />
            <span className="text-sm text-cyan-300">AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Manage <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Finances</span>
            <br />
            with Neural Intelligence
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            An AI-powered financial management platform that helps you track, analyze, 
            and optimize your spending with real-time quantum insights.
          </p>
          
          <button className="bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group">
            Initialize System
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Neural Financial Suite
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to manage your finances with quantum-level precision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activation Protocol */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Neural Activation Protocol
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activationSteps.map((step, index) => (
              <div key={index} className={`relative bg-slate-800/30 backdrop-blur-sm border rounded-2xl p-8 text-center transition-all duration-500 ${
                activeStep === index ? 'border-cyan-400 bg-slate-800/60 scale-105' : 'border-slate-700/50'
              }`}>
                <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  activeStep === index ? 'bg-gradient-to-r from-pink-400 to-purple-500' : 'bg-slate-700'
                }`}>
                  {step.step}
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                  activeStep === index ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-slate-700'
                }`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              User Testimonials
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Activate Financial Intelligence?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of users who are already managing their finances smarter with NeoWealth
          </p>
          <button className="bg-gradient-to-r from-cyan-400 to-purple-500 px-12 py-4 rounded-lg text-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group">
            Start Neural Trial
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">◉</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NeoWealth</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 NeoWealth. All rights reserved. | Powered by Neural Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NeoWealthLanding;