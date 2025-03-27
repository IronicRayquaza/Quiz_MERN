import express from "express";
import User from "../models/User.js";
import admin from "firebase-admin"; // Firebase authentication

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, role, firebase_uid } = req.body;
    
    const existingUser = await User.findOne({ firebase_uid });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, role, firebase_uid });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Verify and get user info from Firebase UID
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebase_uid: decodedToken.uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
