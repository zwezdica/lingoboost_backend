const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordsController");

router.get("/words/search", wordController.searchWord);

router.post("/words", wordController.addWord);

router.delete("/words/:id", wordController.deleteWord);

module.exports = router;
