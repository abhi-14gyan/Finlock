const express = require('express');
const router = express.Router();
const { getCurrentBudget, updateBudget } = require('../controllers/budgetController');
const { verifyJWT } = require("../middlewares/auth.middleware");

router.get('/', verifyJWT, getCurrentBudget);
router.post('/', verifyJWT, updateBudget);

module.exports = router;
