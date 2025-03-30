const express = require("express");
const router = express.Router();
const dragdropsController = require("../controllers/dragdropsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/words/:lang", dragdropsController.getWordsByLanguage);

router.post("/words", protect, admin, dragdropsController.addWord);

router.put("/words/:id", protect, admin, dragdropsController.updateWord);

router.delete("/words/:id", protect, admin, dragdropsController.deleteWord);

module.exports = router;
