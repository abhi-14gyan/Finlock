const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransaction,
  updateTransaction,
  getUserTransactions,
  scanReceipt,
} = require("../controllers/transactions.controller");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { rateLimiter } = require("../middlewares/arcjet.middleware");
// Create a transaction
router.post("/", verifyJWT, rateLimiter, createTransaction);

// Get all transactions of the user
router.get("/", verifyJWT, getUserTransactions);

// Get a specific transaction by ID
router.get("/:id", verifyJWT, getTransaction);

// Update a specific transaction by ID
router.put("/:id", verifyJWT, updateTransaction);

//scan reciept
router.post("/scan-receipt", verifyJWT, upload.single("file"), scanReceipt);

module.exports = router;
