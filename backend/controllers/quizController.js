const Quiz = require("../models/quizModel");

const getQuizzes = async (req, res) => {
  try {
    const { language } = req.params;
    console.log("Language from request:", language);
    const quizzes = await Quiz.find({ language });

    if (quizzes.length === 0) {
      return res
        .status(404)
        .json({ message: `No quizzes found for language: ${language}` });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.log("Error getting quizzes:", error);
    res.status(500).json({ message: "Error retrieving quizzes", error });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { question, options, answer, language } = req.body;

    if (!question || !options || !answer || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = new Quiz({ question, options, answer, language });

    await newQuiz.save();

    res.status(201).json({ message: "Quiz created successfully!" });
  } catch (error) {
    console.log("Error creating quiz:", error);
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer, language } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { question, options, answer, language },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Quiz updated successfully!", updatedQuiz });
  } catch (error) {
    console.log("Error updating quiz:", error);
    res.status(500).json({ message: "Error updating quiz", error });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    console.log("Error deleting quiz:", error);
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
