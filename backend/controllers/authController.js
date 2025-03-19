const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const LoginLog = require("../models/loginLogModel");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("Received registration data:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    console.log("User object created:", newUser);

    await newUser.save();
    console.log("User saved to database");

    const tokenResponse = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", tokenResponse, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const loginLog = new LoginLog({
      userId: user._id,
      username: user.username,
    });

    console.log("Login log to be saved:", loginLog);
    await loginLog.save();
    console.log("Login log saved successfully");

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
};
