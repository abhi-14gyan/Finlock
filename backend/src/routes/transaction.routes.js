const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransaction,
  updateTransaction,
  getUserTransactions,
} = require("../controllers/transactions.model");

const { verifyJWT } = require("../middlewares/auth.middleware");

// Create a transaction
router.post("/", verifyJWT, createTransaction);

// Get all transactions of the user
router.get("/", verifyJWT, getUserTransactions);

// Get a specific transaction by ID
router.get("/:id", verifyJWT, getTransaction);

// Update a specific transaction by ID
router.put("/:id", verifyJWT, updateTransaction);

module.exports = router;
