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

module.exports = {
  getWordsByLanguage,
};
