const express = require("express");

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationsController,
  bookAppointmentController,
  bookingAvailibilityController,
  userAppointmentsController,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// login route
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post(
  "/get-all-notifications",
  authMiddleware,
  getAllNotificationController
);
router.post(
  "/delete-all-notifications",
  authMiddleware,
  deleteAllNotificationsController
);

router.post("/book-appointment", authMiddleware, bookAppointmentController);
router.post(
  "/booking-availibility",
  authMiddleware,
  bookingAvailibilityController
);

router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
