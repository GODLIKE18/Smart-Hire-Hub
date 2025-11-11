import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please provide a company name."],
    minLength: [2, "Company name must contain at least 2 characters!"],
    maxLength: [80, "Company name cannot exceed 80 characters!"],
    validate: {
      validator: function (v) {
        // Allow letters, numbers, spaces, dots, ampersands, hyphens and apostrophes
        // Hyphen does not need escaping when placed at the end of the character class
        return /^[a-zA-Z0-9 .&'-]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid company name!.`,
    },
  },
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid title!.`
    }
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
    minLength: [10, "Description must contain at least 10 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid description!.`
    }
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
    enum: {
      values: [
        "Graphics & Design",
        "Mobile App Development",
        "Frontend Web Development",
        "Backend Development",
        "Full Stack Development",
        "MERN Stack Development",
        "MEAN Stack Development",
        "MEVN Stack Development",
        "Account & Finance",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Data Engineering",
        "DevOps & Cloud",
        "Cyber Security",
        "Blockchain & Web3",
        "Game Development",
        "Embedded Systems",
        "IoT (Internet of Things)",
        "UI/UX Design",
        "Video Animation",
        "AR/VR Development",
        "Quality Assurance / Testing",
        "Product Management",
        "Project Management",
        "Technical Writing",
        "Sales & Business Development",
        "Marketing & SEO",
        "Human Resources",
        "Customer Support",
        "Data Entry Operator",
        "Healthcare Tech",
        "EdTech",
        "FinTech",
        "Legal & Compliance",
        "Research & Analytics",
        "Supply Chain & Logistics",
        "Operations",
        "Consulting",
        "Content Creation & Media",
        "Copywriting",
        "Open Source Contribution",
      ],
      message: "Invalid category provided.",
    },
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid country name!.`
    }
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid city name!.`
    }
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [3, "Location must contian at least 3 characters!"],
  },
  fixedSalary: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid salary! Salary cannot be negative.`
    }
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
    validate: [
      {
        validator: function(v) {
          return v >= 0;
        },
        message: props => `${props.value} is not a valid salary! Salary cannot be negative.`
      },
      // {
      //   validator: function(v) {
      //     // Access the document context using `this`
      //     return v <= this.salaryTo;
      //   },
      //   message: props => `Salary from (${props.value}) must be less than or equal to Salary to (${this.salaryTo}).`
      // }
    ]
  },
  salaryTo: {
    type: Number,
    minLength: [3, "Salary must contain at least 3 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid salary! Salary cannot be negative.`
    }
    
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
