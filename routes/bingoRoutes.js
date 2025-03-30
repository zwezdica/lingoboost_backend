const express = require("express");
const router = express.Router();
const bingoController = require("../controllers/bingoController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/words", bingoController.getBingoWords);

router.post("/check-translation", bingoController.checkTranslation);

router.post("/words", protect, admin, bingoController.addWord);

router.delete("/words/:wordId", protect, admin, bingoController.deleteWord);

module.exports = router;
