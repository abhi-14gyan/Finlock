const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");

// Helper: parse Decimal128 and format amount
const serializeAmount = (txn) => {
  const obj = txn._doc || txn;
  return {
    ...obj,
    amount: parseFloat(obj.amount?.toString() || 0),
  };
};

// Create Transaction
exports.createTransaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const account = await Account.findOne({
    _id: data.accountId,
    userId,
  });
  if (!account) throw new ApiError(404, "Account not found");

  const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
  const newBalance = parseFloat(account.balance.toString()) + balanceChange;

  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.create([{
      ...data,
      userId,
      nextRecurringDate:
        data.isRecurring && data.recurringInterval
          ? calculateNextRecurringDate(data.date, data.recurringInterval)
          : null,
    }], { session });

    await Account.updateOne(
      { _id: data.accountId },
      { $set: { balance: newBalance } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: serializeAmount(transaction[0]),
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Transaction failed: " + err.message);
  }
});

// Get a transaction
exports.getTransaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const txn = await Transaction.findOne({ _id: id, userId });
  if (!txn) throw new ApiError(404, "Transaction not found");

  res.status(200).json({ success: true, data: serializeAmount(txn) });
});

// Update Transaction
exports.updateTransaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const newData = req.body;

  const oldTxn = await Transaction.findOne({ _id: id, userId }).populate("account");
  if (!oldTxn) throw new ApiError(404, "Transaction not found");

  const oldChange = oldTxn.type === "EXPENSE" ? -oldTxn.amount : oldTxn.amount;
  const newChange = newData.type === "EXPENSE" ? -newData.amount : newData.amount;
  const netChange = newChange - oldChange;

  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const updated = await Transaction.findByIdAndUpdate(id, {
      ...newData,
      nextRecurringDate:
        newData.isRecurring && newData.recurringInterval
          ? calculateNextRecurringDate(newData.date, newData.recurringInterval)
          : null,
    }, { new: true, session });

    await Account.findByIdAndUpdate(
      newData.accountId,
      { $inc: { balance: netChange } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: serializeAmount(updated) });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Update failed: " + err.message);
  }
});

// Get all transactions
exports.getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const query = { userId, ...req.query };
  const transactions = await Transaction.find(query).populate("account").sort({ date: -1 });

  res.status(200).json({ success: true, data: transactions });
});

// Helper: calculate recurring date
const calculateNextRecurringDate = (startDate, interval) => {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
};
