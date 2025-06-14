import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import axios from "axios";

export default function BudgetProgress({ currentExpenses, isDark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState(undefined);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await axios.get("/api/v1/budget", { withCredentials: true });
        if (res.data?.budget) {
          setBudget(res.data.budget);
          setNewBudget(res.data.budget.amount?.toString() || "");
        }
      } catch (err) {
        console.error("❌ Failed to fetch budget:", err);
        setMessage({ type: "error", text: "Could not load budget" });
      }
    };

    fetchBudget();
  }, [refreshTrigger]);

  const themeStyles = {
    dark: {
      background: "bg-[#0F0F1C]",
      card: "bg-[#1C1C2E]/90 border-[#2D2D40]/60",
      input: "bg-[#202030] border-[#3A3A55] text-white placeholder-gray-400 focus:ring-purple-500",
      text: {
        primary: "text-white",
        secondary: "text-gray-400",
        muted: "text-gray-500",
      },
    },
    light: {
      background: "bg-gradient-to-br from-white via-slate-400 to-white",
      card: "bg-white/50 border-slate-200/70",
      input: "bg-slate-60 border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500",
      text: {
        primary: "text-black-900",
        secondary: "text-black-600",
        muted: "text-black-500",
      },
    },
  };

  const theme = isDark ? themeStyles.dark : themeStyles.light;

  const budgetUsed = currentExpenses || 0;
  const budgetTotal = budget?.amount || 0;
  const budgetPercentage = budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        "/api/v1/budget",
        { amount },
        { withCredentials: true }
      );

      if (res.data?.success) {
        setMessage({ type: "success", text: "Budget updated successfully" });
        setIsEditing(false);
        setRefreshTrigger(prev => !prev); // Refetch budget
      } else {
        setMessage({ type: "error", text: res.data?.error || "Update failed" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update budget",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(budget?.amount?.toString() || "");
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className={`${theme.card} border backdrop-blur-sm rounded-xl p-6 mb-8`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Monthly Budget (Default Account)
        </h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <Pencil className={`w-4 h-4 ${theme.text.secondary}`} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className={`px-2 py-1 w-24 rounded-md text-sm ${theme.input}`}
              disabled={isLoading}
            />
            <button onClick={handleUpdateBudget} disabled={isLoading}>
              <Check className="w-4 h-4 text-green-500" />
            </button>
            <button onClick={handleCancel} disabled={isLoading}>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
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

      <span className={`${theme.text.muted} text-sm`}>
        {budgetPercentage.toFixed(1)}% used
      </span>

      {message.text && (
        <div
          className={`mt-3 text-sm ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
