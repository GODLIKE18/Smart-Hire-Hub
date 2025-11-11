import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ].filter(Boolean),
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/profile", profileRouter);

// Lightweight health endpoint for uptime checks and tests
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Avoid opening DB connections during unit tests
if (process.env.NODE_ENV !== "test") {
  dbConnection();
}

app.use(errorMiddleware);
export default app;
