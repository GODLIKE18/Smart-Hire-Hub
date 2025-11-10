import mongoose from "mongoose";

// Profile schema stores extended, optional information for Job Seeker users.
// We keep most mandatory identity fields (name, email, phone) in User.
// This document is 1:1 with a User (unique index) and supplies additional
// details that can be auto‑prefilled when applying for a job.
const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      maxLength: [200, "Address cannot exceed 200 characters"],
    },
    defaultCoverLetter: {
      type: String,
      maxLength: [5000, "Cover letter template too long"],
    },
    bio: {
      type: String,
      maxLength: [1000, "Bio cannot exceed 1000 characters"],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (!Array.isArray(arr)) return false;
          return arr.length <= 50; // sanity limit
        },
        message: "Too many skills provided",
      },
      default: [],
    },
    experienceYears: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      max: [60, "Experience seems unrealistic"],
    },
    education: {
      type: String,
      maxLength: [300, "Education field too long"],
    },
    // Optional persisted resume to save re‑uploads for the user
    resume: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
