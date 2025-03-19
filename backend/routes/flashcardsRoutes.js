const express = require("express");
const { getFlashcards } = require("../controllers/flashcardsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:lang", protect, getFlashcards);

module.exports = router;
