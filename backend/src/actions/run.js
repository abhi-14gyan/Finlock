const mongoose = require("mongoose");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");

async function seedTransactions() {
  await mongoose.connect("mongodb+srv://Finlock:Abhi1834@finlock.5hmnklf.mongodb.net/Finlock", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




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
      const amount = Math.floor(Math.random() * 500) + 50;
      const transaction = new Transaction({
        type,
        amount,
        description: `${type === "INCOME" ? "Received" : "Paid"} transaction`,
        date,
        category: "misc",
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
