const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/register/admin", protect, admin, registerUser);
module.exports = router;
