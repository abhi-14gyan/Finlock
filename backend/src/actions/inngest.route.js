// src/actions/run.js
const { checkBudgetAlerts, generateMonthlyReports } = require("./budgetAlert.function");
module.exports = {
  functions: [checkBudgetAlerts,
    generateMonthlyReports
  ],
};
