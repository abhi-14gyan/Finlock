const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ApiError } = require("../utils/apiError.js");
const { ApiResponse } = require("../utils/apiResponse.js");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Refresh or Access Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedEmail = await User.findOne({ email });
  if (existedEmail) throw new ApiError(409, "Email already exists");

  // let imageUrl = { url: "/public/assets/DefaultUserLogo.png" }; // Default image URL

  // const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
  // if (imageUrlLocalPath) {
  //   const uploadedImage = await uploadOnCloudinary(imageUrlLocalPath);
  //   if (uploadedImage?.url) {
  //     imageUrl = uploadedImage;
  //   }
  // }

  const user = await User.create({
    email,
    password,
    username,
    imageUrl: null, // Explicitly set to null
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true, sameSite: "None" };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    });

    const options = { httpOnly: true, secure: true, sameSite:"None" };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });

  } catch (error) {
    return next(new ApiError(500, error.message || "Logout failed"));
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh Token");
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token expired or used");
    }

    const options = { httpOnly: true, secure: true, samSite: "None" };
    res.cookie("accessToken", accessToken, options);
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access Token Refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserName = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) throw new ApiError(400, "Username field is required");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { username } },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Username Updated Successfully")
  );
});


const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if ((!email)) throw new ApiError(400, "email field is required");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Account Details Updated Successfully"));
});

module.exports = {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  updateUserName,
};
