const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  translations: {
    fr: { type: String },
    es: { type: String },
    de: { type: String },
    it: { type: String },
  },
});

const Word = mongoose.models.Word || mongoose.model("Word", wordSchema);

module.exports = Word;
