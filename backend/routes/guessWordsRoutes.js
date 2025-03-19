const express = require("express");
const {
  startGame,
  guessLetter,
  addWord,
  updateWord,
  deleteWord,
} = require("../controllers/guessWordsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }
  next();
};

router.get("/start", protect, startGame);

router.post("/guess/:letter", protect, guessLetter);

router.post("/add", protect, adminOnly, addWord);

router.put("/update/:wordId", protect, adminOnly, updateWord);

router.delete("/delete/:wordId", protect, adminOnly, deleteWord);

module.exports = router;
