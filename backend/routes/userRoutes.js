const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserInfo,
  getUserLoginLogs,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/userController");

router.get("/info", protect, getUserInfo);
router.get("/logs", protect, getUserLoginLogs);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
