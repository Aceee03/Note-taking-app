require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();
const User = require("./models/userSchema");
const Note = require("./models/noteSchema");

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// CREATE ACCOUNT ENDPOINT
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({ error: true, message: "Email already in use" });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

// LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ error: true, message: "Please fill in all required fields" });
  }

  const isUser = await User.findOne({ email });

  if (!isUser) {
    res.status(401).json({ error: true, message: "This user does not exist" });
  }

  if (isUser.email === email && password === isUser.password) {
    const user = { user: isUser };
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600m",
    });

    return res.json({
      error: false,
      email,
      accessToken,
      message: "Logged in successfully",
    });
  } else {
    return res.json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

// ADD NEW NOTE API
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "A title for the note is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }
  try {
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await newNote.save();

    return res.json({
      error: false,
      newNote,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

// EDIT NOTE API
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

// GET ALL NOTES API
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server error during notes retrieval",
    });
  }
});

// DELETE NOTE API
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });

    if (!note) {
      res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      error: false,
      note,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error during note deletion",
    });
  }
});

// PIN NOTE API
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (isPinned) note.isPinned = isPinned;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note pinned successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Internal server error during note pin",
    });
  }
});

//GET USER API
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res
      .status(404)
      .json({ error: true, message: "User does not exist" });
  }

  return res.json({
    user: { fullName: isUser.fullName, email: isUser.email, _id: isUser._id , createdOn: isUser.createdOn },
    message: ""
  });
});


app.listen(8000);

module.exports = app;
