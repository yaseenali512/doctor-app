const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDoctorInfoController,
  updateDoctorInfoController,
  getAlldoctorsController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");
const router = express.Router();

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);
router.post("/updateDoctorInfo", authMiddleware, updateDoctorInfoController);
router.get("/get-all-doctors", authMiddleware, getAlldoctorsController);
router.post("/get-doctor-byId", authMiddleware, getDoctorByIdController);
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
