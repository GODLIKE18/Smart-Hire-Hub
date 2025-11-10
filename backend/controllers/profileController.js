import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Profile } from "../models/profileSchema.js";

// GET /api/v1/profile/me
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) return next(new ErrorHandler("User Not Authorized", 401));
  if (req.user.role !== "Job Seeker") {
    return next(new ErrorHandler("Only Job Seekers have profiles.", 403));
  }
  const profile = await Profile.findOne({ user: req.user._id });
  res.status(200).json({ success: true, profile });
});

// POST /api/v1/profile/upsert
export const upsertMyProfile = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) return next(new ErrorHandler("User Not Authorized", 401));
  if (req.user.role !== "Job Seeker") {
    return next(new ErrorHandler("Only Job Seekers can edit profile.", 403));
  }

  const {
    address = "",
    defaultCoverLetter = "",
    bio = "",
    skills = [],
    experienceYears = undefined,
    education = "",
  } = req.body || {};

  const payload = {
    address,
    defaultCoverLetter,
    bio,
    skills: Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : String(skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    experienceYears,
    education,
  };

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: payload, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, message: "Profile saved.", profile });
});
