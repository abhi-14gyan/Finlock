require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport"); // ✅ NEW: import passport


const app = express();

// ✅ Load passport config (Google strategy)

require("./config/passport");

// Middlewares
app.use(
  cors({
    origin: process.env.COURSE_ORIGIN, // e.g., "http://localhost:3000"
    credentials: true,
  })//used to allow cross origin resouce sharing (server running at localhost:4000 and frontend running at 3000,
  // //  to send requests from different origins)
);

app.use(express.json({ limit: "16kb" }));//used for post method
app.use(express.urlencoded({ extended: true, limit: "16kb" }));// converts input from frontend to usable object (req.body)
app.use(express.static("public"));//public folders can be accessed
app.use(cookieParser());

// ✅ Initialize Passport
app.use(passport.initialize());

// Routes import
const userRouter = require("./routes/user.routes.js");
const authRouter = require("./routes/auth.routes.js"); // ✅ NEW: Import Google OAuth router

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter); // ✅ NEW: Use Google OAuth routes

module.exports = { app };
