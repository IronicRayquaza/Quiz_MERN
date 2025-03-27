

import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "Users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          toast.error("User data not found!");
        }
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch MCQs from Firestore
  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const mcqCollection = collection(db, "MCQs");
        const mcqSnapshot = await getDocs(mcqCollection);
        const mcqList = mcqSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMcqs(mcqList);
      } catch (error) {
        toast.error("Failed to fetch MCQs!");
      }
    };

    fetchMCQs();
  }, []);

  // Handle Answer Selection
  const handleAnswerSelect = (mcqId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [mcqId]: option,
    }));
  };

  // Handle Submission
  const handleSubmit = () => {
    if (Object.keys(answers).length < mcqs.length) {
      toast.warn("Please answer all questions!");
      return;
    }

    let newResults = {};
    mcqs.forEach((mcq) => {
      newResults[mcq.id] = answers[mcq.id] === mcq.correct_answer;
    });

    setResults(newResults);
    setSubmitted(true);
    toast.success("Answers submitted! Check your results.");
  };

  // Logout Function
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-blue-600">Student Dashboard</h2>

        {userData && <p className="text-gray-700 text-center mt-2">Welcome, {userData.fullName}!</p>}

        {/* MCQ Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Attempt MCQs</h3>
          {mcqs.length > 0 ? (
            mcqs.map((mcq) => (
              <div key={mcq.id} className="bg-gray-50 p-4 rounded-lg shadow-md mt-4">
                <p className="text-lg font-medium text-gray-900">{mcq.question}</p>
                <div className="mt-2 space-y-2">
                  {mcq.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-2 text-gray-700 ${
                        submitted
                          ? answers[mcq.id] === option
                            ? answers[mcq.id] === mcq.correct_answer
                              ? "bg-green-200 p-1 rounded-md"
                              : "bg-red-200 p-1 rounded-md"
                            : option === mcq.correct_answer
                            ? "bg-green-100 p-1 rounded-md"
                            : ""
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${mcq.id}`}
                        value={option}
                        checked={answers[mcq.id] === option}
                        onChange={() => handleAnswerSelect(mcq.id, option)}
                        disabled={submitted}
                        className="w-5 h-5 text-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {/* Show Correct/Incorrect */}
                {submitted && (
                  <p className={`mt-2 font-semibold ${results[mcq.id] ? "text-green-600" : "text-red-600"}`}>
                    {results[mcq.id] ? "Correct ✅" : "Incorrect ❌"}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No MCQs available.</p>
          )}
        </div>

        {/* Submit Button */}
        {!submitted && mcqs.length > 0 && (
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Submit Answers
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
