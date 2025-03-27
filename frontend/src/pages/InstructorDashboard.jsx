


import { useState } from "react";
import { toast } from "react-toastify";

const InstructorDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!options.includes(correctAnswer)) {
      toast.error("Correct answer must be one of the options!");
      return;
    }

    const mcqData = {
      question_text: question,
      options,
      correct_answer: correctAnswer,
    };

    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mcqData),
      });

      if (response.ok) {
        toast.success("Question added successfully!");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
      } else {
        toast.error("Failed to add question. Try again.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Instructor Dashboard</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Input */}
        <div>
          <label className="block font-semibold">Question:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {/* Options Inputs */}
        {options.map((option, index) => (
          <div key={index}>
            <label className="block font-semibold">Option {index + 1}:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        {/* Correct Answer Dropdown */}
        <div>
          <label className="block font-semibold">Correct Answer:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select the correct answer</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default InstructorDashboard;
