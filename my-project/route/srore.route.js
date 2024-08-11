import express from "express";
import { getscore, addScore } from "../backend/controller/score.controller.js"; // Import the correct controller functions

const router = express.Router();

// Route to get all scores (Leaderboard)
router.get("/", getscore); // Correct method names

// Route to post a new score
router.post("/", addScore);

export default router;
