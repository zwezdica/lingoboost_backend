const GuessWord = require("../models/guessWordsModel");

const getRandomWord = async (language) => {
  const word = await GuessWord.aggregate([
    { $match: { [`translations.${language}`]: { $exists: true } } },
    { $sample: { size: 1 } },
  ]);

  if (!word || word.length === 0) {
    throw new Error(`No words found for language: ${language}`);
  }

  console.log("Random word from DB:", word[0]);
  return word[0];
};

const getHiddenWord = (word, correctGuesses) => {
  return word
    .split("")
    .map((char) => (correctGuesses.includes(char) ? char : "_"))
    .join("");
};

let gameData = {};

const startGame = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const userId = req.user._id;
    const selectedLanguage = req.query.lang || "en";

    const word = await getRandomWord(selectedLanguage);
    console.log("Selected word:", word);

    if (!word.translations[selectedLanguage] || !word.meaning) {
      throw new Error("Word or meaning is missing in the database.");
    }

    gameData[userId] = {
      word: word.translations[selectedLanguage],
      meaning: word.meaning,
      correctGuesses: [],
    };

    res.json({
      hiddenWord: getHiddenWord(gameData[userId].word, []),
      language: selectedLanguage,
      meaning: word.meaning,
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const guessLetter = (req, res) => {
  const userId = req.user._id;
  const letter = req.params.letter;
  console.log("Received letter:", letter);

  if (!gameData[userId]) {
    return res
      .status(400)
      .json({ message: "You need to start the game first." });
  }

  const { word, correctGuesses, meaning } = gameData[userId];

  if (!letter || letter.length !== 1) {
    return res.status(400).json({ message: "Invalid letter input." });
  }

  if (correctGuesses.includes(letter)) {
    return res.json({
      success: false,
      message: "Letter already guessed.",
      hiddenWord: getHiddenWord(word, correctGuesses),
      meaning: meaning,
    });
  }

  const success = word.includes(letter);
  if (success) correctGuesses.push(letter);

  gameData[userId].correctGuesses = correctGuesses;
  const hiddenWord = getHiddenWord(word, correctGuesses);

  if (hiddenWord === word) {
    return res.json({
      success: true,
      hiddenWord,
      meaning: gameData[userId].meaning,
    });
  }

  res.json({ success, hiddenWord, meaning });
};

const addWord = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can add words." });
    }

    const { word, meaning, translations } = req.body;

    if (!word || !meaning || !translations) {
      return res.status(400).json({
        message: "All fields (word, meaning, translations) are required.",
      });
    }

    const newWord = new GuessWord({ word, meaning, translations });
    await newWord.save();

    res.status(201).json(newWord);
  } catch (error) {
    console.error("Error adding word:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const updateWord = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can update words." });
    }

    const { wordId } = req.params;
    const { word, meaning, translations } = req.body;

    if (!word || !meaning || !translations) {
      return res.status(400).json({
        message: "All fields (word, meaning, translations) are required.",
      });
    }

    const updatedWord = await GuessWord.findByIdAndUpdate(
      wordId,
      { word, meaning, translations },
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: "Word not found." });
    }

    res.json(updatedWord);
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const deleteWord = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can delete words." });
    }

    const { wordId } = req.params;

    const deletedWord = await GuessWord.findByIdAndDelete(wordId);

    if (!deletedWord) {
      return res.status(404).json({ message: "Word not found." });
    }

    res.json({ message: "Word deleted successfully." });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const searchWord = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can search words." });
    }

    const { word } = req.query;

    if (!word) {
      return res.status(400).json({ message: "Word is required for search." });
    }

    const words = await GuessWord.find({
      word: { $regex: word, $options: "i" }, // Case-insensitive pretraga
    });

    if (!words || words.length === 0) {
      return res.status(404).json({ message: "No words found." });
    }

    res.json(words);
  } catch (error) {
    console.error("Error searching word:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  startGame,
  guessLetter,
  addWord,
  updateWord,
  deleteWord,
  searchWord,
};
