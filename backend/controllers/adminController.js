const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const LoginLog = require("../models/loginLogModel");

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ message: "Admin cannot delete themselves" });
    }

    await User.findByIdAndDelete(userId);
    await LoginLog.deleteMany({ userId });

    res.status(200).json({ message: "User and related logs deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, role } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    if (req.user.id === req.params.id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "Admin cannot change their own role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLoginLogs = async (req, res) => {
  try {
    const { username, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (username) {
      filter.username = username;
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * limit;
    const logs = await LoginLog.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalLogs = await LoginLog.countDocuments(filter);

    res.status(200).json({
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching login logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteLoginLog = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const logId = req.params.id;
    const log = await LoginLog.findById(logId);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    await LoginLog.findByIdAndDelete(logId);

    res.status(200).json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
  getLoginLogs,
  deleteLoginLog,
};
