
const express = require("express");
const { searchWord } = require("../controllers/wordController");

const router = express.Router();


router.get("/search", searchWord);

module.exports = router;
