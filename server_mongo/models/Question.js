import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  options: { type: [String], required: true },
  correct_answer: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
