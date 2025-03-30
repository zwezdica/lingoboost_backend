const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/:language", quizController.getQuizzes);

router.post("/", protect, admin, quizController.createQuiz);
router.put("/:id", protect, admin, quizController.updateQuiz);
router.delete("/:id", protect, admin, quizController.deleteQuiz);

module.exports = router;
