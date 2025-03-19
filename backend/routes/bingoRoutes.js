const express = require("express");
const bingoController = require("../controllers/bingoController");

const router = express.Router();

router.get("/words", bingoController.getBingoWords);
router.post("/check-translation", bingoController.checkTranslation);

module.exports = router;
