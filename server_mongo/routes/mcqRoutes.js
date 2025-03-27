import express from "express";
import MCQ from "../models/Question.js";
import User from "../models/User.js";

const router = express.Router();

// Instructor adds a new MCQ
router.post("/add", async (req, res) => {
  try {
    const { question, options, correctAnswer, instructorId } = req.body;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can add MCQs" });
    }

    const newMCQ = new MCQ({ question, options, correctAnswer, createdBy: instructorId });
    await newMCQ.save();

    res.status(201).json({ message: "MCQ added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch all MCQs for students
router.get("/", async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
