const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUser,
  getLoginLogs,
  deleteLoginLog,
} = require("../controllers/adminController");

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

router.get("/loginLogs", getLoginLogs);
router.delete("/loginLogs/:id", deleteLoginLog);
module.exports = router;
