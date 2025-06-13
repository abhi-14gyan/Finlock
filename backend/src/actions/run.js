const mongoose = require("mongoose");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");

async function seedTransactions() {
  await mongoose.connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const CATEGORIES = {
    INCOME: [
      { name: "salary", range: [5000, 8000] },
      { name: "freelance", range: [1000, 3000] },
      { name: "investments", range: [500, 2000] },
      { name: "other-income", range: [100, 1000] },
    ],
    EXPENSE: [
      { name: "housing", range: [1000, 2000] },
      { name: "transportation", range: [100, 500] },
      { name: "groceries", range: [200, 600] },
      { name: "utilities", range: [100, 300] },
      { name: "entertainment", range: [50, 200] },
      { name: "food", range: [50, 150] },
      { name: "shopping", range: [100, 500] },
      { name: "healthcare", range: [100, 1000] },
      { name: "education", range: [200, 1000] },
      { name: "travel", range: [500, 2000] },
    ],
  };

  function getRandomAmount(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  function getRandomCategory(type) {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
  }

  const ACCOUNT_ID = "68490a10fb5f6ad1b09b0474";
  const USER_ID = "6841604dd7c0b4d9fb62b318";

  const transactions = [];
  let totalBalance = 0;

  const startDate = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);

    const txCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < txCount; j++) {
      const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
      const { category, amount } = getRandomCategory(type);

      const transaction = new Transaction({
        type,
        amount: mongoose.Types.Decimal128.fromString(amount.toString()),
        description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
        date,
        category,
        status: "COMPLETED",
        userId: USER_ID,
        accountId: ACCOUNT_ID,
      });

      transactions.push(transaction);
      totalBalance += type === "INCOME" ? amount : -amount;
    }
  }

  await Transaction.deleteMany({ accountId: ACCOUNT_ID });
  await Transaction.insertMany(transactions);
  await Account.findByIdAndUpdate(ACCOUNT_ID, { balance: totalBalance });

  console.log(`✅ Seeded ${transactions.length} transactions successfully.`);
  mongoose.disconnect();
}

seedTransactions();
