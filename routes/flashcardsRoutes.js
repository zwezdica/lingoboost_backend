const express = require("express");
const router = express.Router();
const flashcardsController = require("../controllers/flashcardsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/:lang", flashcardsController.getFlashcards);

router.post("/", protect, admin, flashcardsController.addFlashcard);

router.put("/:id", protect, admin, flashcardsController.updateFlashcard);

router.delete("/:id", protect, admin, flashcardsController.deleteFlashcard);

module.exports = router;
