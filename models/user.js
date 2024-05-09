const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Add enum for role validation
      default: "user", // Default role is "user"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
