const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const { ApiError } = require("../utils/apiError.js");
const { ApiResponse } = require("../utils/apiResponse.js");
// Utility to convert Decimal128 to Number
const serializeDecimal = (obj) => {
  const serialized = { ...obj._doc };
  if (obj.balance) serialized.balance = parseFloat(obj.balance.toString());
  if (obj.amount) serialized.amount = parseFloat(obj.amount.toString());
  return serialized;
};

// GET account with transactions
exports.getAccountWithTransactions = async (req, res) => {
  const userId = req.user._id; // assuming auth middleware sets req.user

  const account = await Account.findOne({
    _id: req.params.accountId,
    userId
  })
    .lean()
    .populate({
      path: 'transactions',
      options: { sort: { date: -1 } }
    });

  if (!account) {
    throw new ApiError(404, 'Account not found');
  }

  const transactions = await Transaction.find({ accountId: account._id }).sort({ date: -1 });
  const serializedTransactions = transactions.map(serializeDecimal);

  res.status(200).json(new ApiResponse(200, {
    ...serializeDecimal(account),
    transactions: serializedTransactions,
    _count: { transactions: serializedTransactions.length }
  }));
};

// DELETE multiple transactions & update balances
exports.bulkDeleteTransactions = async (req, res) => {
  const userId = req.user._id;
  const transactionIds = req.body.transactionIds;

  const transactions = await Transaction.find({ _id: { $in: transactionIds }, userId });

  const accountBalanceChanges = {};
  for (const txn of transactions) {
    const change = txn.type === 'EXPENSE' ? txn.amount : -txn.amount;
    const accId = txn.accountId.toString();
    accountBalanceChanges[accId] = (accountBalanceChanges[accId] || 0) + parseFloat(change.toString());
  }

  const session = await Account.startSession();
  try {
    session.startTransaction();

    await Transaction.deleteMany({ _id: { $in: transactionIds }, userId }).session(session);

    for (const [accId, change] of Object.entries(accountBalanceChanges)) {
      await Account.findByIdAndUpdate(accId, {
        $inc: { balance: change }
      }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(new ApiResponse(200, { success: true }, "Transactions deleted and balances updated"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message);
  }
};

// UPDATE default account
exports.updateDefaultAccount = async (req, res) => {
  const userId = req.user._id;
  const { accountId } = req.params;

  const account = await Account.findOne({ _id: accountId, userId });
  if (!account) throw new ApiError(404, "Account not found");

  await Account.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } });

  account.isDefault = true;
  await account.save();

  res.status(200).json(new ApiResponse(200, serializeDecimal(account), "Default account updated"));
};
