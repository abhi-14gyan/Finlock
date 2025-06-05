const express = require("express");
const { getAccountWithTransactions, bulkDeleteTransactions, updateDefaultAccount } = require("../controllers/account.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/:accountId", verifyJWT, getAccountWithTransactions);
router.delete("/transactions/bulk-delete", verifyJWT, bulkDeleteTransactions);
router.put("/default/:accountId", verifyJWT, updateDefaultAccount);

module.exports = router;
