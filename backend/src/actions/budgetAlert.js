const { inngest } = require("../inngest");
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");

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

const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    console.log("🚀 Cron job triggered");

    const budgets = await step.run("fetch-budgets", async () => {
      return await Budget.find({}).populate({
        path: "userId",
        populate: {
          path: "accounts",
        },
      });
    });

    console.log("✅ Budgets fetched:", budgets.length);

    for (const budget of budgets) {
      const user = budget.userId;
      const accounts = user?.accounts || [];

      if (!accounts.length) {
        console.log("⚠️ No accounts found for user:", user?._id?.toString());
        continue;
      }

      await step.run(`check-budget-${budget._id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1); // Start of current month

        const accountIds = accounts.map((acc) => acc._id);

        // Fetch all EXPENSE transactions across user's accounts this month
        const expensesAgg = await Transaction.aggregate([
          {
            $match: {
              userId: user._id,
              accountId: { $in: accountIds },
              type: "EXPENSE",
              date: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const totalExpenses = expensesAgg[0]?.total || 0;
        console.log("📊 Total Expenses:", totalExpenses);

        // Safely handle Decimal128 budget amount
        const budgetAmount = parseDecimal128(budget.amount);
        console.log("🧪 Original Budget Amount:", budget.amount);
        console.log("🧪 Parsed Budget Amount:", budgetAmount);

        if (isNaN(budgetAmount) || budgetAmount === 0) {
          console.log("❌ Skipping due to invalid budget amount:", budget.amount);
          return;
        }

        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log("📈 Budget usage:", percentageUsed.toFixed(2) + "%");

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          console.log("⚠ Budget threshold exceeded. Sending alert.");
          console.log("User ID:", user._id.toString());
          console.log("Budget ID:", budget._id.toString());
          console.log("User Email:", user.email);
          console.log("Percentage Used:", percentageUsed.toFixed(2) + "%");

          // Send email logic (uncomment if implemented)
          /*
          await sendEmail({
            to: user.email,
            subject: `⚠️ Budget Alert`,
            react: EmailTemplate({
              userName: user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
              },
            }),
          });
          */

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
