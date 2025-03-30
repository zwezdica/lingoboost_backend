const Word = require("../models/dragdropsModel");

const getWordsByLanguage = async (req, res) => {
  const { lang } = req.params;

  try {
    const words = await Word.find({});

    const formattedWords = words.map((word) => ({
      word: word.word,
      translation: word.translations?.[lang] || "No translation available",
    }));

    console.log("Sending data to client:", formattedWords);
    res.json(formattedWords);
  } catch (error) {
    console.error("Error fetching words:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addWord = async (req, res) => {
  const { word, translations } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      return res.status(400).json({ message: "Word already exists" });
    }

    const newWord = new Word({ word, translations });
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

const updateWord = async (req, res) => {
  const { id } = req.params;
  const { word, translations } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const updatedWord = await Word.findByIdAndUpdate(
      id,
      { word, translations },
      { new: true, runValidators: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json({ message: "Word updated successfully", updatedWord });
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWordsByLanguage,
  addWord,
  deleteWord,
  updateWord,
};
