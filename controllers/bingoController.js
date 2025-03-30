const Bingo = require("../models/bingoModel");

const getBingoWords = async (req, res) => {
  try {
    const { level } = req.query;
    const size = level === "easy" ? 3 : level === "medium" ? 4 : 5;
    const words = await Bingo.aggregate([{ $sample: { size: size * size } }]);
    res.status(200).json({ words });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the words", error });
  }
};

const checkTranslation = async (req, res) => {
  try {
    const { wordId, language, userTranslation } = req.body;
    const word = await Bingo.findById(wordId);
    if (!word) {
      return res.status(404).json({ message: "Word not found" });
    }
    const correctTranslation = word.translations[language];
    const isCorrect = userTranslation === correctTranslation;
    res.status(200).json({ isCorrect, correctTranslation });
  } catch (error) {
    res.status(500).json({ message: "Error checking translation", error });
  }
};

const addWord = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { word, translations } = req.body;
    const newWord = new Bingo({ word, translations });
    await newWord.save();
    res.status(201).json({ message: "Word added successfully", newWord });
  } catch (error) {
    res.status(500).json({ message: "Error adding word", error });
  }
};

const deleteWord = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { wordId } = req.params;
    const deletedWord = await Bingo.findByIdAndDelete(wordId);
    if (!deletedWord) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.status(200).json({ message: "Word deleted successfully", deletedWord });
  } catch (error) {
    res.status(500).json({ message: "Error deleting word", error });
  }
};

module.exports = {
  getBingoWords,
  checkTranslation,
  addWord,
  deleteWord,
};
