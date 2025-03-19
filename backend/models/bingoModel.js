const mongoose = require("mongoose");

const bingoSchema = new mongoose.Schema({
  word: String,
  meaning: String,
  translations: {
    fr: String,
    es: String,
    de: String,
    it: String,
  },
});

const Bingo = mongoose.model("Bingo", bingoSchema, "bingo");

module.exports = Bingo;
