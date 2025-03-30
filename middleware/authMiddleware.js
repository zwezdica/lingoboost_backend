const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Extracted Token:", token);

    try {
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      req.user = await User.findById(decoded.userId).select("-password");
      console.log("User from token:", req.user);

      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    console.log("No token provided");
    res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protect };

const admin = (req, res, next) => {
  console.log("User info in admin middleware:", req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.log("Access denied. User role is not admin.");
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

module.exports = { protect, admin };
