const express = require("express");
const router = express.Router();
const Court = require("../models/court");
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
      return
    }
  }
  res.status(201).send("Booking added successfully!");
};

courtControllers.deleteCourt = async (req, res) => {

  Court.findOneAndDelete(req.body)
  .then(() => {
    res.status(200).send("Court was deleted successfully")
  })
  .catch(err => {
    res.status(500).send("There was an error with deleting the court")
  })
}

courtControllers.bookedCourt = async (req, res) => {
  const bookings = await Court.find(
    {},
    {
      timeBooked: 1,
      courtBooked: 1,
      dayBooked: 1,
      yearBooked: 1,
      monthBooked: 1,
      _id: 0,
      userBooked: 1,
    }
  );
  res.json(bookings);
};

module.exports = courtControllers;
