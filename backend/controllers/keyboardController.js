const Keyboard = require("../models/keyboardModel");

const createKeyboard = async (req, res) => {
  const { language, keyboard } = req.body;

  try {
    const newKeyboard = new Keyboard({
      language,
      keyboard,
    });

    await newKeyboard.save();
    res.status(201).json(newKeyboard);
  } catch (error) {
    console.error("Error creating keyboard:", error);
    res.status(500).json({ message: "Error creating keyboard" });
  }
};

const getAllKeyboards = async (req, res) => {
  try {
    const keyboards = await Keyboard.find();
    res.json(keyboards);
  } catch (error) {
    console.error("Error fetching keyboards:", error);
    res.status(500).json({ message: "Error fetching keyboards" });
  }
};

const getKeyboardByLanguage = async (req, res) => {
  const { language } = req.params;

  try {
    const keyboard = await Keyboard.findOne({ language });

    if (!keyboard) {
      return res
        .status(404)
        .json({ message: "Keyboard not found for this language" });
    }

    res.json(keyboard);
  } catch (error) {
    console.error("Error fetching keyboard:", error);
    res.status(500).json({ message: "Error fetching keyboard" });
  }
};

const updateKeyboard = async (req, res) => {
  const { language } = req.params;
  const { keyboard } = req.body;

  try {
    const updatedKeyboard = await Keyboard.findOneAndUpdate(
      { language },
      { keyboard },
      { new: true }
    );

    if (!updatedKeyboard) {
      return res
        .status(404)
        .json({ message: "Keyboard not found for this language" });
    }

    res.json(updatedKeyboard);
  } catch (error) {
    console.error("Error updating keyboard:", error);
    res.status(500).json({ message: "Error updating keyboard" });
  }
};

const deleteKeyboard = async (req, res) => {
  const { language } = req.params;

  try {
    const deletedKeyboard = await Keyboard.findOneAndDelete({ language });

    if (!deletedKeyboard) {
      return res
        .status(404)
        .json({ message: "Keyboard not found for this language" });
    }

    res.json({ message: `Keyboard for ${language} deleted successfully` });
  } catch (error) {
    console.error("Error deleting keyboard:", error);
    res.status(500).json({ message: "Error deleting keyboard" });
  }
};

module.exports = {
  createKeyboard,
  getAllKeyboards,
  getKeyboardByLanguage,
  updateKeyboard,
  deleteKeyboard,
};
