var express = require("express");
var router = express.Router();
const User = require("../models/user");
const userControllers = {};
const bcrypt = require("bcrypt");
const saltRounds = 10;

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

userControllers.creatingUser = async (req, res) => {
  const { name, id, username, password } = req.body;

  const isEmailValid = isValidEmail(username);
  if (!isEmailValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
      errorCode: 10002,
    });
  }
  if (password.length < 4) {
    return res.json({
      success: false,
      message: "Password must have at least 6 characters",
      errorCode: 10003,
    });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.json({ success: false, message: "Username already exists" });
  }
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ name, username, password: hashedPassword, id });

    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error registering user" });
  }
};

userControllers.loggingUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password",
        errorCode: 10001,
      });
    }

    if (password === user.password) {
      res.json({
        ...user._doc,
        success: true,
        message: "Login successful",
        username: user.name,
        id: user._id,
      });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

userControllers.resetingUser = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Can't Find Email",
      });
    } else {
      res.json({
        success: true,
        message: "Account Found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

userControllers.updateNewPassword = async (req, res) => {
  const { username, password } = req.body;

  await User.findOneAndUpdate({ username }, { password })
    .then((_) =>
      res.json({
        success: true,
        message: "Password has been updated",
      })
    )
    .catch((_) =>
      res.status(500).json({
        success: false,
        message: "Could not update the password",
      })
    );
};

userControllers.displayAll = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Send the users as a response
    res.status(200).json(users);
  } catch (error) {
    // If there's an error, send an error response
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userControllers.softDeleting = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    user.delete = true;
    await user.save();
    res.status(200).json({ message: "User soft deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred during the operation" });
  }
};
module.exports = userControllers;
