import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Search, ChevronDown, Sun, Moon, Clock, MoreHorizontal, Edit2, ChevronLeft, ChevronRight, ChevronUp, Trash, X } from 'lucide-react';
import { Plus, LogOut, Menu, ArrowUp, ArrowDown, LayoutGrid, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import Dropdown from '../components/Dropdown';
import { AccountBarChart } from '../components/accountchart';

//components
import logo from "../assets/Finlocklogo.png";
import UsernameCard from "../components/UsernameCard";

const AccountPage = () => {
  const { accountId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setselectedType] = useState("All Types");
  const [selectedPeriod, setSelectedPeriod] = useState('Last Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [SortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  })
  const { user, setUser, checkingAuth } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [transactionCount, settransactionCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  
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
      card: 'bg-white/90 border-slate-200/70',
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

  const theme = isDark ? themeStyles.dark : themeStyles.light;

  // Chart data for the last month
  const chartData = [
    { date: 'Nov 15', income: 3000, expense: 0 },
    { date: 'Nov 16', income: 1500, expense: 1200 },
    { date: 'Nov 17', income: 2500, expense: 0 },
    { date: 'Nov 18', income: 0, expense: 1300 },
    { date: 'Nov 19', income: 3000, expense: 0 },
    { date: 'Nov 20', income: 0, expense: 1800 },
    { date: 'Nov 21', income: 2000, expense: 0 },
    { date: 'Nov 22', income: 1800, expense: 0 },
    { date: 'Nov 23', income: 0, expense: 1500 },
    { date: 'Nov 24', income: 2000, expense: 0 },
    { date: 'Nov 25', income: 3200, expense: 0 },
    { date: 'Nov 26', income: 1800, expense: 1900 },
    { date: 'Nov 27', income: 7200, expense: 2100 },
    { date: 'Nov 28', income: 7800, expense: 2000 },
    { date: 'Nov 29', income: 10500, expense: 0 },
    { date: 'Nov 30', income: 1500, expense: 0 },
    { date: 'Dec 01', income: 3000, expense: 0 },
    { date: 'Dec 02', income: 6200, expense: 1800 },
    { date: 'Dec 03', income: 5800, expense: 0 },
    { date: 'Dec 04', income: 0, expense: 0 },
    { date: 'Dec 05', income: 5800, expense: 0 }
  ];

  const categoryColors = {
    // INCOME
    salary: '#10B981',           // Emerald
    freelance: '#06B6D4',        // Cyan
    investments: '#3B82F6',      // Blue
    'other-income': '#6366F1',   // Indigo

    // EXPENSE
    housing: '#F59E0B',          // Amber
    transportation: '#EF4444',   // Red
    groceries: '#22C55E',        // Green
    utilities: '#EAB308',        // Yellow
    entertainment: '#8B5CF6',    // Violet
    food: '#F97316',             // Orange
    shopping: '#EC4899',         // Pink
    healthcare: '#DB2777',       // Fuchsia
    education: '#0EA5E9',        // Sky Blue
    travel: '#9333EA'            // Purple
  };

  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/account/${accountId}`, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setAccountData(response.data.data);
      } else {
        setError('Account not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch account details');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);




  const handleSort = (field) => {
    setSortConfig(current => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }))
  }
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = paginatedTransactions.map(t => t._id);
      setSelectedTransactions(allIds);
    } else {
      setSelectedTransactions([]);
    }
  };


  const handleSelectTransaction = (id) => {
    setSelectedTransactions(current => current.includes(id) ? current.filter(item => item != id) : [...current, id])
  };

  const handlebulkdelete = async (transactionIds) => {
    try {
      const response = await axios.delete("/api/v1/account/transactions/bulk-delete", {
        data: { transactionIds },
        withCredentials: true,
      });

      toast.success("Deleted Successfully")

      // ✅ Refresh account/transaction data
      fetchAccountDetails();

      // ✅ clear selection
      setSelectedTransactions([]);
    } catch (error) {
      toast.error("Failed to Delete:");
    }
  };

  const handleUserDropdown = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All Categories")
    setselectedType("All Types")
    setSelectedTransactions([])
  }

  // const filteredTransactions = accountData?.transactions.filter(transaction => {
  //   const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = selectedCategory === 'All Types' || transaction.category === selectedCategory;
  //   return matchesSearch && matchesFilter;
  // }) || [];

  const filteredTransactions = useMemo(() => {
    let result = [...(accountData?.transactions || [])];

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter(transaction => transaction.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(transaction =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply recurring filter
    if (selectedType === "recurring") {
      result = result.filter(transaction => transaction.isRecurring);
    } else if (selectedType === "non-recurring") {
      result = result.filter(transaction => !transaction.isRecurring);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (SortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return SortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [accountData?.transactions, selectedCategory, searchTerm, selectedType, SortConfig]);




  const transactionsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  //const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  // Apply pagination to filtered transactions
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  useEffect(() => {
    let count = 0;
    let income = 0;
    let expenses = 0;
    filteredTransactions.forEach((t) => {
      count++;
      const amount = parseFloat(t.amount);
      if (t.type === "INCOME") income += amount;
      else if (t.type === "EXPENSE") expenses += amount;
    });
    setTotalIncome(income);
    setTotalExpenses(expenses);
    settransactionCount(count);
  }, [filteredTransactions]); // runs when transactions change

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className={`${theme.text.primary} text-lg`}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

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

  const deleteFn = (ids) => {
    // You can call an API here or update state
    if (!Array.isArray(ids)) return;

    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    // Example: filter out deleted IDs from your data
    setAccountData((prevData) => ({
      ...prevData,
      transactions: prevData.transactions.filter((t) => !ids.includes(t.id)),
    }));

    // Also remove from selected if needed
    setSelectedTransactions((current) =>
      current.filter((id) => !ids.includes(id))
    );
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
        <div className="flex justify-between items-center mb-8 flex-wrap md:flex-nowrap">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
            <img src={logo} alt="Finlock Logo" className="h-10 w-10" />
            <span className={`text-2xl font-bold ${theme.text.primary}`}>Finlock</span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${theme.card} border backdrop-blur-sm transition-all duration-200 hover:scale-105`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button onClick={() => navigate("/transaction", { state: { from: `/account/${accountId}` } })} className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
              <Edit2 className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            <button onClick={handleUserDropdown} className="flex items-center gap-2 group">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className={`text-sm font-medium ${theme.text.primary} group-hover:underline`}>
                {user?.username || "User"}
              </span>
            </button>
            {/* Overlay with blur */}
            {showDropdown && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end items-start z-50 p-6">
                <div className="mt-12 mr-4">
                  <UsernameCard onClose={() => setShowDropdown(false)} />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center ml-auto mt-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
            >
              <Menu className="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="w-full mt-4 md:hidden flex flex-col space-y-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${theme.card} border backdrop-blur-sm flex items-center space-x-2`}
              >
                {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span className={`${theme.text.primary}`}>Toggle Theme</span>
              </button>

              <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button onClick={() => navigate("/transaction", { state: { from: `/account/${accountId}` } })} className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${theme.text.primary} mb-2`} style={{ color: '#EAB308' }}>
              {accountData.name}
            </h1>
            <p className={`${theme.text.secondary} text-lg`}>{accountData.type}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${theme.text.primary} mb-1`}>
              ₹{accountData.balance.toFixed(2)}
            </div>
            <p className={`${theme.text.secondary}`}>
              {transactionCount} Transactions
            </p>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`mt-4 p-2 rounded-lg ${theme.card} border backdrop-blur-sm transition-all duration-200 hover:scale-105`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Account Bar Chart */}

        {accountData?.transactions && (
          <AccountBarChart transactions={accountData.transactions} />
        )}



        {/* Search and Filters */}
        <div className="flex justify-between items-center mt-10 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.text.muted}`} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${theme.input} w-full pl-10 py-2 rounded-lg border focus:outline-none focus:ring-2`}
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}
            >
              <option>All Categories</option>
              <optgroup label="Income">
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investments">Investments</option>
                <option value="other-income">Other Income</option>
              </optgroup>
              <optgroup label="Expenses">
                <option value="housing">Housing</option>
                <option value="transportation">Transportation</option>
                <option value="groceries">Groceries</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="travel">Travel</option>
              </optgroup>
            </select>

          </div>

          <div className="flex space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setselectedType(e.target.value)}
              className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}
            >
              <option>All Types</option>
              <option value="recurring">Recurring-only</option>
              <option value="non-recurring">Non-Recurring-only</option>
            </select>

            {selectedTransactions.length > 0 && (
              <div>
                <button
                  onClick={() => handlebulkdelete(selectedTransactions)}
                  className="rounded-lg w-full px-4 py-2 hover:bg-red-100 text-left text-red-600"
                >
                  <div className="flex gap-2">
                    <Trash className="h-5 w-5" />
                    Delete Selected ({selectedTransactions.length})
                  </div>
                </button>
              </div>
            )}


            {(selectedCategory !== "All Categories" || selectedType !== "All Types" || searchTerm !== "" || selectedTransactions.length > 0) && (
              <button className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}
                onClick={clearFilters}>
                <X className="h-4 w-5" />
              </button>
            )}

          </div>
        </div>

        {/* Transactions Table */}
        <div className={`${theme.card} border backdrop-blur-sm rounded-xl overflow-hidden`}>
          {/* Table Header */}
          <div className={`px-6 py-4 border-b ${theme.divider}`}>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
              <button onClick={() => handleSort("date")}
                className={`col-span-2 font-medium ${theme.text.secondary} text-sm flex items-center px-3 py-1 rounded-md`}>
                Date {SortConfig.field === "date" && (SortConfig.direction === "asc" ? (<ChevronUp className="w-4 h-4 ml-1" />) : (
                  <ChevronDown className="w-4 h-4 ml-1" />))}
              </button>
              <div className={`col-span-3 font-medium ${theme.text.secondary} text-sm`}>Description</div>
              <button onClick={() => handleSort("category")}
                className={`col-span-2 font-medium ${theme.text.secondary} text-sm flex items-center px-3 py-1 rounded-md`}>
                Category {SortConfig.field === "category" && (SortConfig.direction === "asc" ? (<ChevronUp className="w-4 h-4 ml-1" />) : (
                  <ChevronDown className="w-4 h-4 ml-1" />))}
              </button>
              <button onClick={() => handleSort("amount")}
                className={`col-span-2 font-medium ${theme.text.secondary} text-sm flex items-center px-3 py-1 rounded-md`}>
                Amount {SortConfig.field === "amount" && (SortConfig.direction === "asc" ? (<ChevronUp className="w-4 h-4 ml-1" />) : (
                  <ChevronDown className="w-4 h-4 ml-1" />))}
              </button>
              <div className={`col-span-2 font-medium ${theme.text.secondary} text-sm`}>Recurring</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction._id} className={`px-6 py-4 hover:bg-gray-50/5 transition-colors`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectTransaction(transaction._id)}
                      checked={selectedTransactions.includes(transaction._id)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className={`col-span-2 ${theme.text.primary} text-sm`}>
                    {format(parseISO(transaction.date), "dd-MM-yyyy hh:mm a")}
                  </div>
                  <div className={`col-span-3 ${theme.text.primary} font-medium`}>
                    {transaction.description}
                  </div>
                  <div className="col-span-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: categoryColors[transaction.category] }}
                    >
                      {transaction.category}
                    </span>
                  </div>
                  <div className={`col-span-2 font-semibold ${transaction.type === "EXPENSE" ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.type === "EXPENSE" ? '-' : '+'}₹{Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  <div className={`col-span-1 ${theme.text.secondary} text-sm flex items-center`}>
                    <Clock className="w-4 h-4 mr-1" />
                    {transaction.isRecurring ? "YES" : "NO"}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Dropdown transaction={transaction} deleteFn={deleteFn} accountId={accountId} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={`px-6 py-4 border-t ${theme.divider} flex justify-between items-center`}>
            <div className={`${theme.text.secondary} text-sm`}>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${theme.card} border bg-white hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${theme.card} border bg-white hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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

export default AccountPage;