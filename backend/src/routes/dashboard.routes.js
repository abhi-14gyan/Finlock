const express = require("express");
const router = express.Router();
const {
  getUserAccounts,
  createAccount,
  getDashboardData,
  deleteAccount,
} = require("../controllers/dashboard.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

router.use(verifyJWT); // All dashboard routes require auth

router.get("/accounts", verifyJWT,  getUserAccounts);
router.post("/accounts", createAccount);
router.get("/transactions", getDashboardData);
router.delete("/accounts/:accountId",verifyJWT, deleteAccount );
module.exports = router;
