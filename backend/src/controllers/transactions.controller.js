const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const mongoose = require("mongoose");
const { Decimal128 } = mongoose.Types;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

  // Convert amount to Decimal128
  const amountDecimal = Decimal128.fromString(data.amount.toString());

  // Calculate new balance using Decimal128 logic
  const balanceChange = data.type === "EXPENSE"
    ? -parseFloat(data.amount)
    : parseFloat(data.amount);

  const newBalance = parseFloat(account.balance.toString()) + balanceChange;

  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.create(
      [{
        ...data,
        userId,
        amount: amountDecimal, // ✅ corrected here
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(data.date, data.recurringInterval)
            : null,
      }],
      { session }
    );

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
    console.error("Transaction creation failed:", err); // Add this for debug
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

  const oldTxn = await Transaction.findOne({ _id: id, userId }).populate("accountId");
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


// Scan Receipt
exports.scanReceipt = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read file from disk and convert to base64
    const filePath = path.join(__dirname, "../../public/temp", file.originalname);
    const fileBuffer = fs.readFileSync(filePath);
    const base64String = fileBuffer.toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )

      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If it's not a receipt, return an empty object
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.mimetype,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);

      // Optionally: delete file after reading
      fs.unlinkSync(filePath);

      return res.status(200).json({
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      });
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return res.status(500).json({ error: "Invalid response format from Gemini" });
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return res.status(500).json({ error: "Failed to scan receipt" });
  }
};