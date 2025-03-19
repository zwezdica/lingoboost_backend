const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Koristimo username kao jedinstveno polje
  games: {
    bingo: { type: Number, default: 0 },
    dragAndDrop: { type: Number, default: 0 },
    flashcards: { type: Number, default: 0 },
    guessWord: { type: Number, default: 0 },
    quiz: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Progress", userProgressSchema);
