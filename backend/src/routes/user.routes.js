const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  updateUserName,
} = require("../controllers/user.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

// Public Routes
router.post("/register", upload.fields([{ name: "imageUrl", maxCount: 1 }]), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getUser);
router.put("/update-account", verifyJWT, updateAccountDetails);
router.put("/update-username", verifyJWT, updateUserName);

module.exports = router;
