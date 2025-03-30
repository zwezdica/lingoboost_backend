const Flashcard = require("../models/flashcardsModel");

const getFlashcards = async (req, res) => {
  const { lang } = req.params;
  const { limit = 9, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const flashcards = await Flashcard.find().skip(skip).limit(Number(limit));

    const totalCards = await Flashcard.countDocuments();

    const result = flashcards.map((card) => {
      const translation = card.translations[lang];
      return {
        word: card.word,
        translation: translation || "Translation not available",
      };
    });

    res.json({ flashcards: result, totalCards });
  } catch (error) {
    res.status(500).json({
      message: "Error loading cards",
      error,
    });
  }
};

const addFlashcard = async (req, res) => {
  const { word, translations } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const existingFlashcard = await Flashcard.findOne({ word });
    if (existingFlashcard) {
      return res.status(400).json({ message: "Flashcard already exists" });
    }

    const newFlashcard = new Flashcard({ word, translations });
    await newFlashcard.save();

    res
      .status(201)
      .json({ message: "Flashcard added successfully", newFlashcard });
  } catch (error) {
    console.error("Error adding flashcard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFlashcard = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const deletedFlashcard = await Flashcard.findByIdAndDelete(id);
    if (!deletedFlashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res
      .status(200)
      .json({ message: "Flashcard deleted successfully", deletedFlashcard });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateFlashcard = async (req, res) => {
  const { id } = req.params;
  const { word, translations } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      id,
      { word, translations },
      { new: true, runValidators: true }
    );

    if (!updatedFlashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.status(200).json({
      message: "Flashcard updated successfully",
      updatedFlashcard,
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFlashcards,
  addFlashcard,
  deleteFlashcard,
  updateFlashcard,
};
