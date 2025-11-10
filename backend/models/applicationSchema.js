import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: [true, "Please provide a title."],
  //   minLength: [3, "Title must contain at least 3 Characters!"],
  //   maxLength: [30, "Title cannot exceed 30 Characters!"],
  //   validate: {
  //     validator: function(v) {
  //       return /^[a-zA-Z]+$/.test(v);
  //     },
  //     message: props => `${props.value} is not a valid.`
  //   }
  // },
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [2, "Name must contain at least 2 characters!"],
    maxLength: [60, "Name cannot exceed 60 characters!"],
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return false;
        // Allow letters with spaces, dots, hyphens, and apostrophes: e.g., "omkar kurade", "Anne-Marie O'Neil", "J. R. R. Tolkien"
        return /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name! Provide a valid full name.`,
    },
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your Phone Number!"],
    trim: true,
    validate: {
      validator: function (v) {
        // Accept exactly 10 digits; stored as string to preserve leading zeros
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number! Please enter a 10-digit phone number.`,
    },
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
    // validate: {
    //   validator: function(v) {
    //     return /^[a-zA-Z]+$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid address, provide valid address.`
    // }
  },
  resume: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
  // Track the lifecycle of the application. "Applied" on creation, then Employer
  // can mark as "Shortlisted" or "Rejected". Keeping as a simple string enum
  // instead of numeric codes makes the API more readable for the frontend.
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected"],
    default: "Applied",
    required: true,
  },
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
