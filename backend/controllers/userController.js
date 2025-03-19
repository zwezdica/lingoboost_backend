const User = require("../models/userModel");
const LoginLog = require("../models/loginLogModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const getUserInfo = async (req, res) => {
  console.log("User info in controller:", req.user);
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found in request" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    res.json({
      username: user.username,
      email: user.email,
      language: user.language || "fr",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserLoginLogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await LoginLog.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalLogs = await LoginLog.countDocuments({ userId });

    res.status(200).json({
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching user login logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserInfo,
  getUserLoginLogs,
  requestPasswordReset,
  resetPassword,
};
