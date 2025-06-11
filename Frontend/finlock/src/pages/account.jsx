import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Search, ChevronDown, Sun, Moon, Clock, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const AccountPage = () => {
  const { accountId } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Types');
  const [selectedPeriod, setSelectedPeriod] = useState('Last Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

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

  // Mock data for demonstration - replace with actual API data
  const mockAccountData = {
    // name: 'Personal',
    // type: 'Savings Account',
    // balance: 152113.90,
    transactionCount: 188,
    totalIncome: 57378.46,
    totalExpenses: 16118.94,
    netAmount: 41259.52,
    transactions: [
      { id: 1, date: 'Dec 12, 2024', description: 'Flat Rent (Recurring)', category: 'Rental', amount: -1500.00, recurring: 'One-time' },
      { id: 2, date: 'Dec 8, 2024', description: 'Netflix (Recurring)', category: 'Entertainment', amount: -10.00, recurring: 'One-time' },
      { id: 3, date: 'Dec 5, 2024', description: 'Paid for shopping', category: 'Shopping', amount: -157.21, recurring: 'One-time' },
      { id: 4, date: 'Dec 5, 2024', description: 'Received salary', category: 'Salary', amount: 5549.52, recurring: 'One-time' },
      { id: 5, date: 'Dec 4, 2024', description: 'Paid for shopping', category: 'Shopping', amount: -418.58, recurring: 'One-time' },
      { id: 6, date: 'Dec 3, 2024', description: 'Paid for shopping', category: 'Shopping', amount: -227.26, recurring: 'One-time' },
      { id: 7, date: 'Dec 3, 2024', description: 'Received salary', category: 'Salary', amount: 6189.10, recurring: 'One-time' },
      { id: 8, date: 'Dec 2, 2024', description: 'Received freelance', category: 'Freelance', amount: 2864.91, recurring: 'One-time' },
      { id: 9, date: 'Dec 2, 2024', description: 'Paid for shopping', category: 'Shopping', amount: -358.08, recurring: 'One-time' },
      { id: 10, date: 'Dec 2, 2024', description: 'Paid for travel', category: 'Travel', amount: -1251.66, recurring: 'One-time' }
    ]
  };

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
    'Rental': '#F59E0B',
    'Entertainment': '#8B5CF6',
    'Shopping': '#EC4899',
    'Salary': '#10B981',
    'Freelance': '#06B6D4',
    'Travel': '#06B6D4'
  };

  useEffect(() => {
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

    fetchAccountDetails();
  }, [accountId]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(accountData.transactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id, checked) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, id]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(selectedId => selectedId !== id));
    }
  };

  const filteredTransactions = accountData?.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All Types' || transaction.category === selectedFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  const transactionsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${theme.text.primary} mb-2`} style={{ color: '#6366F1' }}>
              {accountData.name}
            </h1>
            <p className={`${theme.text.secondary} text-lg`}>{accountData.type}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${theme.text.primary} mb-1`}>
              ${accountData.balance.toFixed(2)}
            </div>
            <p className={`${theme.text.secondary}`}>
              {accountData?.transactionCount || "0"} Transactions
            </p>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`mt-4 p-2 rounded-lg ${theme.card} border backdrop-blur-sm transition-all duration-200 hover:scale-105`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Transaction Overview */}
        <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 mb-8`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${theme.text.primary}`}>Transaction Overview</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}
            >
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-sm ${theme.text.secondary} mb-1`}>Total Income</div>
              <div className="text-2xl font-bold text-green-500">
                ${accountData?.totalIncome?.toFixed(2) || '57378.46'}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${theme.text.secondary} mb-1`}>Total Expenses</div>
              <div className="text-2xl font-bold text-red-500">
                ${accountData?.totalExpenses?.toFixed(2) || '16118.94'}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${theme.text.secondary} mb-1`}>Net</div>
              <div className="text-2xl font-bold text-green-500">
                ${accountData?.netAmount?.toFixed(2) || '41259.52'}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: theme.text.secondary.includes('white') ? '#9CA3AF' : '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: theme.text.secondary.includes('white') ? '#9CA3AF' : '#6B7280' }}
                />
                <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className={`${theme.text.secondary} text-sm`}>Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className={`${theme.text.secondary} text-sm`}>Expense</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
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
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}
            >
              <option>All Types</option>
              <option>Rental</option>
              <option>Entertainment</option>
              <option>Shopping</option>
              <option>Salary</option>
              <option>Freelance</option>
              <option>Travel</option>
            </select>
            <select className={`${theme.input} rounded-lg px-4 py-2 border focus:outline-none focus:ring-2`}>
              <option>All Transactions</option>
              <option>Income Only</option>
              <option>Expenses Only</option>
            </select>
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
              <div className={`col-span-2 font-medium ${theme.text.secondary} text-sm flex items-center`}>
                Date <ChevronDown className="w-4 h-4 ml-1" />
              </div>
              <div className={`col-span-3 font-medium ${theme.text.secondary} text-sm`}>Description</div>
              <div className={`col-span-2 font-medium ${theme.text.secondary} text-sm`}>Category</div>
              <div className={`col-span-2 font-medium ${theme.text.secondary} text-sm`}>Amount</div>
              <div className={`col-span-2 font-medium ${theme.text.secondary} text-sm`}>Recurring</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction.id} className={`px-6 py-4 hover:bg-gray-50/5 transition-colors`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={(e) => handleSelectTransaction(transaction.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className={`col-span-2 ${theme.text.primary} text-sm`}>
                    {transaction.date}
                  </div>
                  <div className={`col-span-3 ${theme.text.primary} font-medium`}>
                    {transaction.description}
                  </div>
                  <div className="col-span-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: categoryColors[transaction.category] || '#6B7280' }}
                    >
                      {transaction.category}
                    </span>
                  </div>
                  <div className={`col-span-2 font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  <div className={`col-span-1 ${theme.text.secondary} text-sm flex items-center`}>
                    <Clock className="w-4 h-4 mr-1" />
                    {transaction.recurring}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className={`p-1 hover:bg-gray-100 rounded ${theme.text.secondary}`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
                className={`p-2 rounded-lg ${theme.card} border hover:bg-gray-50/5 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${theme.card} border hover:bg-gray-50/5 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;