import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import AddTransactionForm from "../components/transaction-form";
import { defaultCategories } from "../data/category";
import { Plus, Sun, Moon, LogOut, Menu, ArrowUp, ArrowDown, LayoutGrid, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

//pages
import logo from "../assets/Finlocklogo.png";


const AddTransactionPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const navigate = useNavigate();
    const { user, setUser, checkingAuth } = useAuth();
    const [isDark, setIsDark] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRes = await axios.get('/api/v1/dashboard/accounts', {
                    withCredentials: true,
                }); // Authenticated route
                setAccounts(accountRes.data.data);
                console.log("API Fetch for Accounts", accountRes.data);
                if (editId) {
                    const txnRes = await axios.get(`/api/v1/transaction/${editId}`);
                    setInitialData(txnRes.data.data);
                }
            } catch (err) {
                console.error("Error loading form data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [editId]);

    if (loading) return <div className="text-center mt-8">Loading...</div>;


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

    return (
        <div className={`min-h-screen ${theme.background} transition-all duration-300 relative overflow-hidden`}>
            {/* Decorative background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 left-10 w-72 h-72 ${theme.decorativeOrbs.first} rounded-full blur-3xl opacity-20`}></div>
                <div className={`absolute top-40 right-20 w-96 h-96 ${theme.decorativeOrbs.second} rounded-full blur-3xl opacity-20`}></div>
                <div className={`absolute bottom-20 left-1/2 w-80 h-80 ${theme.decorativeOrbs.third} rounded-full blur-3xl opacity-20`}></div>
            </div>
            <div className="relative z-10 p-6 max-w-7xl mx-auto">
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

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                            <User className="w-5 h-5 text-white" />
                        </div>
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

                            <button className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
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

                <div className="flex justify-center md:justify-normal mb-8">
                    <h1 className={`text-4xl font-bold ${theme.text.primary} mb-2`} style={{ color: '#EAB308' }} >Add Transaction</h1>
                </div>
                <div className="max-w-3xl mx-auto px-5">
                    <AddTransactionForm
                        accounts={accounts}
                        categories={defaultCategories}
                        editMode={!!editId}
                        initialData={initialData}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddTransactionPage;
