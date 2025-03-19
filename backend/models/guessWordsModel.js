const mongoose = require("mongoose");

const guessWordSchema = mongoose.Schema(
  {
    word: { type: String, required: true, unique: true },
    meaning: { type: String, required: true },
    translations: { type: Map, of: String, required: true },
  },
  { timestamps: true }
);

const GuessWord = mongoose.model("GuessWord", guessWordSchema, "guessWords");

module.exports = GuessWord;
