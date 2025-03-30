const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  translations: {
    fr: { type: String },
    es: { type: String },
    de: { type: String },
    it: { type: String },
  },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

module.exports = Flashcard;
