const express = require('express');
const router = express.Router();
const { getCurrentBudget, updateBudget } = require('../controllers/budgetController');
const { verifyJWT } = require("../middlewares/auth.middleware");

router.get('/budget', verifyJWT, getCurrentBudget);
router.post('/budget', verifyJWT, updateBudget);

module.exports = router;
