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

module.exports = { getFlashcards };
