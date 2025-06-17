// src/actions/run.js
const { checkBudgetAlerts } = require("./budgetAlert.function");

module.exports = {
  functions: [checkBudgetAlerts],
};
