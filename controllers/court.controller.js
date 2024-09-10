const express = require("express");
const router = express.Router();
const Court = require("../models/court");
const Content = require("../models/content");
const user = require("../models/user");

const courtControllers = {};

courtControllers.bookingCourt = async (req, res) => {
  const {
    timeBooked,
    dayBooked,
    courtBooked,
    userBooked,
    monthBooked,
    yearBooked,
  } = req.body;
  for (const time of timeBooked) {
    console.log(req.body);
    try {
      const newBooking = new Court({
        timeBooked: time,
        dayBooked,
        courtBooked,
        userBooked,
        monthBooked,
        yearBooked,
      });

      await newBooking.save();
    } catch (error) {
      console.error("Error occurred while inserting the booking:", error);
      res.status(500).send("An error occurred while adding the booking.");
      return;
    }
  }
  res.status(201).send("Booking added successfully!");
};

courtControllers.deleteCourt = async (req, res) => {
  const {
    courtBooked,
    timeBooked,
    dayBooked,
    monthBooked,
    yearBooked,
    userBooked,
  } = req.body;

  console.log(req.body);

  try {
    const deletedCourt = await Court.findOneAndDelete({
      courtBooked: courtBooked,
      timeBooked: timeBooked,
      dayBooked: dayBooked,
      userBooked: userBooked,
      yearBooked: yearBooked,
      monthBooked: monthBooked,
    });

    if (deletedCourt) {
      res.status(200).send("Court was deleted successfully");
    } else {
      res.status(404).send("Court not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error with deleting the court");
  }
};

courtControllers.bookedCourt = async (req, res) => {
  const bookings = await Court.find(
    {},
    {
      timeBooked: 1,
      courtBooked: 1,
      dayBooked: 1,
      yearBooked: 1,
      monthBooked: 1,
      _id: 1,
      userBooked: 1,
    }
  );
  res.json(bookings);
};

courtControllers.postAnnoucement = async (req, res) => {
  try {
    // Extract content from the request body
    const { content } = req.body;

    // Find existing content or create a new one if not found
    let updatedContent = await Content.findOneAndUpdate(
      {}, // Empty query to match any document
      { $set: { content: content } }, // Update operation to set new content
      { upsert: true, new: true } // Options to create new document if not found and return the updated document
    );

    // Send success response with the updated content
    res.status(200).json(updatedContent);
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error posting content:", error);
    res.status(500).json({ error: "Could not post content" });
  }
};

courtControllers.getAnnoucement = async (req, res) => {
  const data = await Content.find({}, { content: 1, _id: 0 });
  res.json(data);
};
module.exports = courtControllers;
