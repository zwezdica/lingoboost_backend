const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const LoginLog = require("../models/loginLogModel");

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    console.log("Received registration data:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword;
    try {
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(String(password), salt);
      console.log("Password hashed successfully");
    } catch (hashError) {
      console.error("Hashing error:", hashError);
      return res.status(500).json({ message: "Password hashing failed" });
    }

    let isAdmin = false;
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await User.findById(decoded.userId);
        isAdmin = adminUser && adminUser.role === "admin";
      }
    } catch (tokenError) {
      console.log("Token verification error:", tokenError);
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: isAdmin && role === "admin" ? "admin" : "user",
    });

    await newUser.save();
    console.log("User saved to database");

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      userId: newUser._id,
      role: newUser.role,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const loginLog = new LoginLog({
      userId: user._id,
      username: user.username,
    });
    await loginLog.save();

    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
      username: user.username,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
