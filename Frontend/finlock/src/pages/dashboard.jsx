import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Sun, Moon, ArrowUp, ArrowDown, Edit2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CreateAccountDrawer } from '../components/CreateAccountDrawer';

const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('personal');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, setUser, checkingAuth } = useAuth();
  const [openDrawer, setOpenDrawer] = useState(false);

  // 🔐 Protect the route
  useEffect(() => {
    if (!checkingAuth) {
      if (!user) {
        navigate("/signin");
      }
    }
  }, [user, checkingAuth, navigate]);

  // Fetch accounts from database
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/dashboard/accounts', {
        withCredentials: true,
      });
      
      if (response.status === 200) {
        // Backend now returns { success: true, data: accounts }
        setAccounts(response.data.data || []);
        console.log('Accounts loaded:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAccounts();
    }
  }, [user]);

  // Refresh accounts when drawer closes (after creating new account)
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    fetchAccounts(); // Refresh the accounts list
  };

  if (checkingAuth) {
    return <div>Loading...</div>; // or your skeleton loader
  }

  const handleClick = () => {
    setOpenDrawer(true);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/v1/users/logout", {}, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(null); // Important for UI state update
        toast.success(res.data?.message || "Logout successful");
        navigate("/");
      } else {
        throw new Error("Unexpected status during logout");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", error?.response?.data?.message || error.message);
    }
  };

  const themeStyles = {
    dark: {
      background: 'bg-[#0F0F1C]',
      card: 'bg-[#1C1C2E]/90 border-[#2D2D40]/60',
      input: 'bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:ring-purple-500',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-400',
        muted: 'text-gray-500'
      },
      decorativeOrbs: {
        first: 'bg-purple-600/30',
        second: 'bg-pink-500/30',
        third: 'bg-indigo-500/30'
      },
      divider: 'border-[#2E2E3A]',
      dividerBg: 'bg-[#1A1A2E]'
    },
    light: {
      background: 'bg-gradient-to-br from-white via-slate-400 to-white',
      card: 'bg-white/50 border-slate-200/70',
      input: 'bg-slate-60 border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500',
      text: {
        primary: 'text-black-900',
        secondary: 'text-black-600',
        muted: 'text-black-500'
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

  const theme = isDark ? themeStyles.dark : themeStyles.light;

  const transactions = [
    { id: 1, title: 'Flat Rent (Recurring)', date: 'Dec 12, 2024', amount: -1500.00, type: 'expense' },
    { id: 2, title: 'Netflix (Recurring)', date: 'Dec 8, 2024', amount: -10.00, type: 'expense' },
    { id: 3, title: 'Received salary', date: 'Dec 5, 2024', amount: 5549.52, type: 'income' },
    { id: 4, title: 'Paid for shopping', date: 'Dec 5, 2024', amount: -157.21, type: 'expense' },
    { id: 5, title: 'Paid for shopping', date: 'Dec 4, 2024', amount: -418.58, type: 'expense' }
  ];

  const expenseData = [
    { name: 'rental', value: 1500.00, color: '#EF4444' },
    { name: 'entertainment', value: 304.33, color: '#10B981' },
    { name: 'shopping', value: 1161.13, color: '#06B6D4' },
    { name: 'travel', value: 1251.66, color: '#84CC16' }
  ];

  const budgetUsed = 4217.12;
  const budgetTotal = 7000.00;
  const budgetPercentage = (budgetUsed / budgetTotal) * 100;

  // Function to get account type color
  const getAccountTypeColor = (type, isDefault) => {
    if (isDefault) return 'bg-green-400';
    
    switch (type?.toLowerCase()) {
      case 'savings':
      case 'savings account':
        return 'bg-blue-400';
      case 'current':
      case 'current account':
        return 'bg-yellow-400';
      case 'investment':
        return 'bg-purple-400';
      case 'credit':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Function to capitalize first letter
  const capitalizeFirst = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1) || '';
  };

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-300 relative overflow-hidden`}>
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 ${theme.decorativeOrbs.first} rounded-full blur-3xl opacity-20`}></div>
        <div className={`absolute top-40 right-20 w-96 h-96 ${theme.decorativeOrbs.second} rounded-full blur-3xl opacity-20`}></div>
        <div className={`absolute bottom-20 left-1/2 w-80 h-80 ${theme.decorativeOrbs.third} rounded-full blur-3xl opacity-20`}></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`${theme.text.primary} text-2xl font-bold`}>
              <span style={{ color: '#FFD700' }}>Finlock</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${theme.card} border backdrop-blur-sm transition-all duration-200 hover:scale-105`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button className={`px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors`}>
              <Edit2 className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Logout
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Dashboard Title */}
        <h1 className={`text-4xl font-bold ${theme.text.primary} mb-8`}>Dashboard</h1>

        {/* Budget Section */}
        <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>Monthly Budget (Default Account)</h2>
            <Edit2 className={`w-4 h-4 ${theme.text.secondary}`} />
          </div>
          <div className="mb-2">
            <span className={`${theme.text.secondary} text-sm`}>
              ${budgetUsed.toFixed(2)} of ${budgetTotal.toFixed(2)} spent
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          <span className={`${theme.text.muted} text-sm`}>{budgetPercentage.toFixed(1)}% used</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text.primary}`}>Recent Transactions</h2>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className={`${theme.input} rounded-lg px-3 py-1 text-sm border focus:outline-none focus:ring-2`}
              >
                {accounts.map((account) => (
                  <option key={account._id} value={account.name.toLowerCase()}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2">
                  <div>
                    <h3 className={`font-medium ${theme.text.primary} text-sm`}>{transaction.title}</h3>
                    <p className={`${theme.text.muted} text-xs`}>{transaction.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {transaction.type === 'income' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Expense Breakdown */}
          <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${theme.text.primary} mb-4`}>Monthly Expense Breakdown</h2>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-6 space-y-2">
                {expenseData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={`${theme.text.secondary} text-sm`}>
                      {item.name}: ${item.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account Cards */}
        <CreateAccountDrawer open={openDrawer} setOpen={setOpenDrawer} onClose={handleDrawerClose} />
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading skeleton */}
            {/* Add New Account */}
            <div
              onClick={handleClick}
              className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] hover:scale-105 transition-transform cursor-pointer`}
            >
              <Plus className={`w-12 h-12 ${theme.text.secondary} mb-3`} />
              <span className={`${theme.text.secondary} text-sm`}>Add New Account</span>
            </div>

            
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add New Account */}
            <div
              onClick={handleClick}
              className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] hover:scale-105 transition-transform cursor-pointer`}
            >
              <Plus className={`w-12 h-12 ${theme.text.secondary} mb-3`} />
              <span className={`${theme.text.secondary} text-sm`}>Add New Account</span>
            </div>

            {/* Dynamic Account Cards */}
            {accounts.map((account) => (
              <div
                key={account._id}
                className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 min-h-[180px] hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`font-semibold ${theme.text.primary}`}>
                    {capitalizeFirst(account.name)}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${getAccountTypeColor(account.type, account.isDefault)}`}></div>
                </div>
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${theme.text.primary}`}>
                    ${parseFloat(account.balance).toFixed(2)}
                  </span>
                  <p className={`${theme.text.muted} text-sm`}>
                    {capitalizeFirst(account.type)}
                    {account.isDefault && <span className="text-green-400 ml-2">(Default)</span>}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className={`${theme.text.secondary} text-sm`}>Income</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="w-4 h-4 text-red-500" />
                    <span className={`${theme.text.secondary} text-sm`}>Expense</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Show message if no accounts */}
            {accounts.length === 0 && (
              <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] col-span-full`}>
                <p className={`${theme.text.secondary} text-center`}>
                  No accounts found. Create your first account to get started!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`${theme.text.muted} text-sm`}>
            Powered by Finlock
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;