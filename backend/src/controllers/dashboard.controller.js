const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/apiError.js");

// Utility to convert Decimal128 to Number for accounts
const serializeAccount = (obj) => {
  // Handle both lean objects and Mongoose documents
  const data = obj._doc ? obj._doc : obj;
  const serialized = { ...data };
  
  if (serialized.balance) {
    serialized.balance = parseFloat(serialized.balance.toString());
  }
  
  return serialized;
};

// Utility to convert Decimal128 to Number for transactions
const serializeTransaction = (obj) => {
  // Handle both lean objects and Mongoose documents
  const data = obj._doc ? obj._doc : obj;
  const serialized = { ...data };
  
  if (serialized.balance) {
    serialized.balance = parseFloat(serialized.balance.toString());
  }
  if (serialized.amount) {
    serialized.amount = parseFloat(serialized.amount.toString());
  }
  
  return serialized;
};

// GET /api/v1/dashboard/accounts
exports.getUserAccounts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const accounts = await Account.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const serializedAccounts = accounts.map(serializeAccount);
  
  console.log('Fetched accounts:', serializedAccounts); // Debug log
  
  res.status(200).json({
    success: true,
    data: serializedAccounts
  });
});

// POST /api/v1/dashboard/accounts
exports.createAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, type, balance, isDefault } = req.body;

  if (isNaN(balance)) {
    throw new ApiError(400, "Invalid balance amount");
  }

  const existingAccounts = await Account.find({ userId });

  const shouldBeDefault = existingAccounts.length === 0 ? true : isDefault;

  if (shouldBeDefault) {
    await Account.updateMany({ userId, isDefault: true }, { isDefault: false });
  }

  const account = await Account.create({
    name,
    type,
    balance,
    isDefault: shouldBeDefault,
    userId,
  });

  res.status(201).json({
    success: true,
    data: serializeAccount(account),
  });
});

// GET /api/v1/dashboard/transactions
exports.getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({ userId }).sort({ date: -1 });

  const serialized = transactions.map(serializeTransaction);
  
  res.status(200).json({
    success: true,
    data: serialized
  });
});