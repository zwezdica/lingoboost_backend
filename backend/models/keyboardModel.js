const mongoose = require("mongoose");

const keyboardSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  keyboard: {
    type: [String],
    required: true,
  },
});

const Keyboard = mongoose.model("Keyboard", keyboardSchema);

module.exports = Keyboard;
