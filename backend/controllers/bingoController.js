const Bingo = require("../models/bingoModel");

exports.getBingoWords = async (req, res) => {
  try {
    const { level } = req.query;
    const size = level === "easy" ? 3 : level === "medium" ? 4 : 5;
    const words = await Bingo.aggregate([{ $sample: { size: size * size } }]);
    res.status(200).json({ words });
  } catch (error) {
    res.status(500).json({ message: "Error fetchin the word", error });
  }
};

exports.checkTranslation = async (req, res) => {
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

module.exports = {
  getBingoWords: exports.getBingoWords,
  checkTranslation: exports.checkTranslation,
};
