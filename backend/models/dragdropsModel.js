const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translations: {
    fr: { type: String },
    es: { type: String },
    de: { type: String },
    it: { type: String },
  },
});

module.exports = mongoose.model("Word", wordSchema);
