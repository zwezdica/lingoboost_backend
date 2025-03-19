const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWordsByLanguage } = require("../controllers/dragdropsController");

router.get("/:lang", protect, getWordsByLanguage);

module.exports = router;
