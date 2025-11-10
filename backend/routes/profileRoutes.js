import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyProfile, upsertMyProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", isAuthenticated, getMyProfile);
router.post("/upsert", isAuthenticated, upsertMyProfile);

export default router;
