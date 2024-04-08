const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const courtSchema = new mongoose.Schema(
  {
    timeBooked: {
      type: String,
      required: true,
    },
    courtBooked: {
      type: String,
      required: true,
    },
    dayBooked: {
      type: String,
      required: true,
    },
    userBooked: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    yearBooked: {
      type: Number,
      required: true,
    },
    monthBooked: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Court", courtSchema);
