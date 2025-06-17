const { inngest } = require("../inngest");

const helloFunction = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" // runs at 12am, 6am, 12pm, 6pm every day
    },
  async ({ step }) => {
    const budget = await step.run("fetch-budget", async () => {
        
    })
  }
);

module.exports = { helloFunction };
