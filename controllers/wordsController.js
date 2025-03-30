const Word = require("../models/wordsModel");

const searchWord = async (req, res) => {
  const { word, language } = req.query;

  if (!word || !language) {
    return res.status(400).json({ message: "Word and language are required" });
  }

  try {
    const wordData = await Word.findOne({ word: word });

    if (!wordData) {
      return res.status(404).json({ message: "Word not found" });
    }

    const translation = wordData.translations[language];
    if (!translation) {
      return res
        .status(404)
        .json({ message: `Translation not found for ${language}` });
    }

    res.json({
      word: wordData.word,
      meaning: wordData.meaning,
      translation: translation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addWord = async (req, res) => {
  const { word, meaning, translations } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      return res.status(400).json({ message: "Word already exists" });
    }

    const newWord = new Word({ word, meaning, translations });
    await newWord.save();

    res.status(201).json({ message: "Word added successfully", newWord });
  } catch (error) {
    console.error("Error adding word:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteWord = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const deletedWord = await Word.findByIdAndDelete(id);
    if (!deletedWord) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json({ message: "Word deleted successfully", deletedWord });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  searchWord,
  addWord,
  deleteWord,
};
