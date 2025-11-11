import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";

dotenv.config({ path: "./config/config.env" });

// Simple utility to log and exit
const done = async (code = 0) => {
  await mongoose.connection.close();
  process.exit(code);
};

// Popular categories shown on the homepage + a QA category for variety
const categories = [
  "Graphics & Design",
  "Mobile App Development",
  "Frontend Web Development",
  "Backend Development",
  "Full Stack Development",
  "MERN Stack Development",
  "Account & Finance",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "DevOps & Cloud",
  "Cyber Security",
  "Blockchain & Web3",
  "UI/UX Design",
  "Video Animation",
  "Game Development",
  "Quality Assurance / Testing",
];

// A pool of sample companies and cities for variety
const companies = [
  "TechNova Labs",
  "CloudSphere",
  "DataForge",
  "SecureLayer",
  "PixelCraft Studio",
  "BlockMint",
  "QuantumOps",
  "UIFlow",
  "AppVelocity",
  "AICatalyst",
];
const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai", "Remote"];
const countries = ["India"];

// Generate a description (kept simple to satisfy validation regex: letters & spaces only)
const makeDescription = (title) => {
  const cleanTitle = title.replace(/[^a-zA-Z\s]/g, "");
  const text = `${cleanTitle} role responsible for building scalable solutions and collaborating with cross functional team`;
  return text.replace(/[^a-zA-Z\s]/g, "").slice(0, 200);
};

// Create salary either fixed or ranged
const makeSalary = (index) => {
  if (index % 3 === 0) {
    // fixed salary
    return { fixedSalary: 800000 + index * 10000 };
  }
  const from = 600000 + index * 8000;
  const to = from + 120000;
  return { salaryFrom: from, salaryTo: to };
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "MERN_JOB_SEEKING_WEBAPP" });
    console.log("Connected to MongoDB");

    // Ensure employer user with name 'praveen' exists
    let employer = await User.findOne({ name: "praveen", role: "Employer" }).select("_id");
    if (!employer) {
      employer = await User.create({
        name: "praveen",
        email: "praveen@example.com",
        phone: 9999999999,
        password: "PraveenPass123", // will be hashed by pre-save hook
        role: "Employer",
      });
      console.log("Created employer user 'praveen'");
    } else {
      console.log("Employer user 'praveen' already exists");
    }

    const postedBy = employer._id;

    // Decide how many jobs to create (between 12-16 for some variability)
  const total = categories.length; // one job per displayed category
    const jobs = [];
    // Title map ensuring only letters & spaces (schema regex restriction) and indicative of role
    const titleMap = {
      "Graphics & Design": "Graphics Designer",
      "Mobile App Development": "Mobile Developer",
      "Frontend Web Development": "Frontend Engineer",
      "Backend Development": "Backend Engineer",
      "Full Stack Development": "Fullstack Engineer",
      "MERN Stack Development": "Mern Developer",
      "Account & Finance": "Finance Associate",
      "Artificial Intelligence": "Ai Engineer",
      "Machine Learning": "Machine Learning Engineer",
      "Data Science": "Data Scientist",
      "DevOps & Cloud": "Devops Engineer",
      "Cyber Security": "Cyber Security Analyst",
      "Blockchain & Web3": "Blockchain Developer",
      "UI/UX Design": "Ui Ux Designer",
      "Video Animation": "Video Animator",
      "Game Development": "Game Developer",
      "Quality Assurance / Testing": "Qa Engineer",
    };
    for (let i = 0; i < total; i++) {
  const category = categories[i];
  const title = titleMap[category];
      const companyName = companies[i % companies.length];
      const city = cities[i % cities.length];
      const country = countries[0];
      const location = city === "Remote" ? "Remote" : `${city} Office`;
      // salary in LPA format (store numeric LPA value)
      const salaryObj = (i % 3 === 0)
        ? { fixedSalary: 10 + (i % 6) } // e.g., 10–15 LPA
        : { salaryFrom: 6 + (i % 6), salaryTo: 6 + (i % 6) + 4 }; // e.g., 6–10 LPA
      jobs.push({
        companyName,
        title,
        description: makeDescription(title),
        category,
        country,
        city: city === "Remote" ? "Bangalore" : city, // keep city strictly letters
        location,
        expired: false,
        postedBy,
        ...salaryObj,
      });
    }

    // Optional: remove previous seeded jobs by this employer to avoid duplicates
    await Job.deleteMany({ postedBy });
  const inserted = await Job.insertMany(jobs);
  console.log(`Inserted ${inserted.length} jobs for employer 'praveen'`);
    await done(0);
  } catch (err) {
    console.error("Seeding failed", err);
    await done(1);
  }
}

run();