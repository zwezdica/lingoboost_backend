const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUser,
  updateUser,
  getLoginLogs,
  getUserLoginLogs,
} = require("../controllers/userController");

router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.put("/users/:id", protect, admin, updateUser);

router.get("/loginlogs", protect, admin, getLoginLogs);
router.get("/users/me/loginlogs", protect, getUserLoginLogs);

module.exports = router;
