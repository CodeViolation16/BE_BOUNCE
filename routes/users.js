var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Court = require("../models/court");
const {
  creatingUser,
  loggingUser,
  resetingUser,
  updateNewPassword,
  displayAll,
  softDeleting,
} = require("../controllers/user.controller");
const {
  bookingCourt,
  bookedCourt,
  deleteCourt,
} = require("../controllers/court.controller");
const loginRequired = require("../middleware/loginRequired");

//USERS
router.post("/", creatingUser);
router.post("/login", loggingUser);
router.put("/reset/new", updateNewPassword);
router.post("/reset", resetingUser);
router.get("/all", displayAll);
router.put("/:userId/soft-delete", softDeleting);
//COURT
router.post("/booking", bookingCourt);
router.get("/booked", bookedCourt);
router.delete("/booking"  , deleteCourt);

module.exports = router;
