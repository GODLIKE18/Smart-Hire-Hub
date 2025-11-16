import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  let { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  email = String(email).trim().toLowerCase();
  role = String(role).trim();
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name: String(name).trim(),
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  let { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password and role."));
  }
  email = String(email).trim().toLowerCase();
  role = String(role).trim();
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (String(user.role).trim() !== role) {
    return next(new ErrorHandler("Incorrect role selected for this account.", 400));
  }
  sendToken(user, 200, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Update logged-in user's basic details
export const updateMe = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone } = req.body || {};

  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Validate and assign if provided
  if (typeof name === "string" && name.trim()) {
    if (name.trim().length < 3 || name.trim().length > 30) {
      return next(new ErrorHandler("Name must be 3-30 characters.", 400));
    }
    user.name = name.trim();
  }
  if (typeof email === "string" && email.trim()) {
    const exists = await User.findOne({ email: email.trim() });
    if (exists && String(exists._id) !== String(user._id)) {
      return next(new ErrorHandler("Email already in use.", 400));
    }
    user.email = email.trim();
  }
  if (typeof phone !== "undefined") {
    const phoneStr = String(phone).trim();
    if (!/^\d{10}$/.test(phoneStr)) {
      return next(new ErrorHandler("Please enter a valid 10-digit phone number.", 400));
    }
    user.phone = Number(phoneStr);
  }

  await user.save();
  res.status(200).json({ success: true, message: "Profile updated.", user });
});