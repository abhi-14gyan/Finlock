const Budget = require('../models/budget.model.js');
const  User  = require("../models/user.model.js");
const Transaction = require('../models/transaction.model.js');

exports.getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user.id; // You’ll get this from auth middleware
    const accountId = req.query.accountId;

    const budget = await Budget.findOne({ userId });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'EXPENSE',
          accountId: accountId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({
      budget: budget ? { ...budget.toObject(), amount: parseFloat(budget.amount) } : null,
      currentExpenses: expenses.length ? parseFloat(expenses[0].total) : 0,
    });
  } catch (err) {
    console.error("Budget fetch error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId },
      { amount },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, budget: { ...budget.toObject(), amount: parseFloat(budget.amount) } });
  } catch (err) {
    console.error("Budget update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
