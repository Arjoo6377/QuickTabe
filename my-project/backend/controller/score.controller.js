// backend/controller/score.controller.js

import Scores from "../model/game.js";

// Fetch and sort scores in descending order
export const getscore = async (req, res) => {
  try {
    // Fetch all scores sorted by score in descending order
    const scores = await Scores.find().sort({ score: -1 });

    // Respond with sorted scores
    res.status(200).json({
      message: "Scores fetched successfully",
      data: scores,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new score
export const addScore = async (req, res) => {
  try {
    const { score, name } = req.body;
    console.log(typeof score);
    // Input validation
    if (!score || !name) {
      return res.status(400).json({ message: "Score and name are required" });
    }

    // Create a new Scores document
    const created = new Scores({ score, name });

    // Save the document
    await created.save();

    // Successful response
    res.status(201).json({
      message: "User created successfully",
      data: created, // Optionally return created document
    });
  } catch (error) {
    console.error(error.message); // Improved error logging
    res.status(500).json({ message: "Internal server error" });
  }
};
