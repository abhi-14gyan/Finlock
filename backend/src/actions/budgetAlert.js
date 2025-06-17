const { inngest } = require("../inngest");
const mongoose = require('mongoose');
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const { sendEmail } = require("../actions/sendEmail");
const { budgetAlertHtml } = require("../../emails/budgetAlertHTML");

function isNewMonth(lastDate, currentDate) {
  return (
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear()
  );
}

function parseDecimal128(decimal128Value) {
  try {
    if (!decimal128Value) return 0;

    // Handle Decimal128 objects
    if (decimal128Value.$numberDecimal) {
      return parseFloat(decimal128Value.$numberDecimal);
    }

    // Handle if it's already a string or number
    if (typeof decimal128Value === 'string' || typeof decimal128Value === 'number') {
      return parseFloat(decimal128Value);
    }

    // Try toString() method for Mongoose Decimal128
    if (decimal128Value.toString) {
      return parseFloat(decimal128Value.toString());
    }

    return 0;
  } catch (err) {
    console.log("❌ Error parsing decimal value:", err.message);
    return 0;
  }
}



// Get monthly stats (total income, expenses, category breakdown) for a user
async function getMonthlyStats(userId, monthDate) {
  const Transaction = require("../models/transaction.model");
  const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = parseFloat(t.amount.toString());
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else if (t.type === "INCOME") {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}


const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    console.log("🚀 Cron job triggered");

    const budgets = await step.run("fetch-budgets", async () => {
      return await Budget.find({}).populate({
        path: "userId",
      });
    });

    console.log("✅ Budgets fetched:", budgets.length);

    for (const budget of budgets) {
      const user = budget.userId;
      await step.run(`check-budget-${budget._id}`, async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const expenses = await Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(user._id), // 👈 Explicitly cast
              type: 'EXPENSE',
              date: { $gte: startOfMonth, $lte: endOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);
        console.log("typeof user._id:", typeof user._id);
        console.log("instanceof ObjectId:", user._id instanceof mongoose.Types.ObjectId);
        // console.log("User:",user);
        // console.log("UserId:", user._id );
        console.log("expenses:", expenses);
        const totalExpenses = expenses.length > 0
          ? parseFloat(expenses[0].total.toString()) // Decimal128 fix
          : 0
        console.log("📊 Total Expenses:", totalExpenses);
        // Safely handle Decimal128 budget amount
        const budgetAmount = parseDecimal128(budget.amount);
        console.log("🧪 Original Budget Amount:", budget.amount);
        console.log("🧪 Parsed Budget Amount:", budgetAmount);
        console.log("🧪 Original Budget Amount:", budget.amount);
        console.log("🧪 Parsed Budget Amount:", budgetAmount);

        if (isNaN(budgetAmount) || budgetAmount <= 0) {
          console.log("❌ Skipping due to invalid budget amount:", budget.amount);
          return;
        }

        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log("📈 Budget usage:", percentageUsed.toFixed(2) + "%");
        // Check if alert should be sent
        const shouldSendAlert = percentageUsed >= 80 && (
          !budget.lastAlertSent ||
          isNewMonth(new Date(budget.lastAlertSent), new Date())
        );

        if (shouldSendAlert) {
          console.log("⚠️ Budget threshold exceeded. Sending alert.");
          console.log("User ID:", user._id.toString());
          console.log("Budget ID:", budget._id.toString());
          console.log("User Email:", user.email);
          console.log("Percentage Used:", percentageUsed.toFixed(2) + "%");

          // Send email logic (uncomment if implemented)

          await sendEmail({
            to: user.email,
            subject: `⚠️ Budget Alert - ${percentageUsed.toFixed(1)}% Used`,
            html: budgetAlertHtml({
              userName: user.name,
              data: {
                percentageUsed: percentageUsed.toFixed(1),
                budgetAmount: budgetAmount.toFixed(2),
                totalExpenses: totalExpenses.toFixed(2),
              },
            }),
          });

          // Update lastAlertSent
          await Budget.updateOne(
            { _id: budget._id },
            { $set: { lastAlertSent: new Date() } }
          );

          console.log(`✅ Updated lastAlertSent for budget: ${budget._id}`);
          console.log(`📧 Alert would be sent to: ${user.email}`);
        } else {
          console.log("✅ No alert needed.");
          if (percentageUsed < 80) {
            console.log(`   - Usage (${percentageUsed.toFixed(2)}%) is below 80% threshold`);
          }
          if (budget.lastAlertSent && !isNewMonth(new Date(budget.lastAlertSent), new Date())) {
            console.log(`   - Alert already sent this month (${new Date(budget.lastAlertSent).toDateString()})`);
          }
        }
      });
    }

    console.log("🏁 Budget alert check completed");
  }
);

module.exports = { checkBudgetAlert };