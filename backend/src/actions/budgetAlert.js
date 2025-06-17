// File: src/inngest/budgetAlert.js (or .ts if you use TypeScript)

const { inngest } = require("../inngest"); // adjust to your inngest instance file
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const User = require("../models/user.model");
//const sendEmail = require("../utils/sendEmail"); // your utility to send emails
//const { EmailTemplate } = require("../templates/emailTemplate"); // React-based email component

function isNewMonth(lastDate, currentDate) {
  return (
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear()
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
        populate: {
          path: "accounts",
          match: { isDefault: true },
        },
      });
    });

    console.log("✅ Budgets fetched:", budgets.length);


    for (const budget of budgets) {
      const defaultAccount = budget.userId.accounts?.[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget._id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1); // First of current month

        const expensesAgg = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId._id,
              accountId: defaultAccount._id,
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
        const budgetAmount = parseFloat(budget.amount.toString());
        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log("⚠️ Before if.");
        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {

          //SEND ALERT EMAIL
          console.log(percentageUsed, budget.lastAlertSent);
          //   await sendEmail({
          //     to: budget.userId.email,
          //     subject: `Budget Alert for ${defaultAccount.name}`,
          //     react: EmailTemplate({
          //       userName: budget.userId.name,
          //       type: "budget-alert",
          //       data: {
          //         percentageUsed,
          //         budgetAmount: parseInt(budgetAmount).toFixed(1),
          //         totalExpenses: parseInt(totalExpenses).toFixed(1),
          //         accountName: defaultAccount.name,
          //       },
          //     }),
          //   });

          //UPDATE LAST EMAIL SENT
          console.log("⚠️ Budget threshold exceeded. Sending alert.");

          console.log("Current budget._id:", budget._id);
          console.log("Last alert sent:", budget.lastAlertSent);

          await Budget.updateOne(
            { _id: budget._id },
            { $set: { lastAlertSent: new Date() } }
          );
          console.log(`Updated lastAlertSent for budget ID: ${budget._id}`);
        }

      });
    }
  }
);


module.exports = { checkBudgetAlert };
