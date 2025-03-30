require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { protect, admin } = require("./middleware/authMiddleware");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dragDropsRoutes = require("./routes/dragdropsRoutes");
const flashcardsRoutes = require("./routes/flashcardsRoutes");
const guessWordsRoutes = require("./routes/guessWordsRoutes");

const bingoRoutes = require("./routes/bingoRoutes");
const keyboardRoutes = require("./routes/keyboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const wordsRoutes = require("./routes/wordsRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", protect, admin, adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/dragdrops", dragDropsRoutes);
app.use("/api/flashcards", flashcardsRoutes);
app.use("/api/guessWords", guessWordsRoutes);

app.use("/api/bingo", bingoRoutes);
app.use("/api/keyboards", keyboardRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api", wordsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
