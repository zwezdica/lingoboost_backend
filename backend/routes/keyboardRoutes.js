const express = require("express");
const router = express.Router();
const {
  createKeyboard,
  getAllKeyboards,
  getKeyboardByLanguage,
  updateKeyboard,
  deleteKeyboard,
} = require("../controllers/keyboardController");

router.post("/", createKeyboard);

router.get("/", getAllKeyboards);

router.get("/:language", getKeyboardByLanguage);

router.put("/:language", updateKeyboard);

router.delete("/:language", deleteKeyboard);

module.exports = router;
