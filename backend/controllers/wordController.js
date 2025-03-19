const Word = require("../models/wordModel");

const searchWord = async (req, res) => {
  const { word, language } = req.query; // Prikazujemo na osnovu reči i jezika

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

module.exports = { searchWord };
