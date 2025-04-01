const express = require("express");
const router = express.Router();
const guessWordsController = require("../controllers/guessWordsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/start", protect, guessWordsController.startGame);

router.post("/guess/:letter", protect, guessWordsController.guessLetter);

router.get("/search", protect, admin, guessWordsController.searchWord);

router.post("/words", protect, admin, guessWordsController.addWord);

router.put("/words/:wordId", protect, admin, guessWordsController.updateWord);

router.delete(
  "/words/:wordId",
  protect,
  admin,
  guessWordsController.deleteWord
);

module.exports = router;
