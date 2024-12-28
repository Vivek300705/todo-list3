import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/users.js";

dotenv.config();

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  if (await User.exists({ email })) {
    return res.status(400).json({ status: false, message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();

  res.status(200).json({ status: true, message: "User registered successfully" });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  const user = await User.findOne({ username: username.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ status: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "Strict" })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Strict" })
    .json({ status: true, message: "Login successful", accessToken, refreshToken });
});

// Refresh Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ status: false, message: "Refresh token required" });
  }

  try {
    const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const { accessToken } = generateTokens(user);
    res.status(200).json({ status: true, message: "Token refreshed", accessToken });
  } catch {
    res.status(401).json({ status: false, message: "Invalid refresh token" });
  }
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ status: true, message: "Logged out successfully" });
});

// Profile
export const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  res.status(200).json({ status: true, message: "Profile fetched", profile: user });
});
