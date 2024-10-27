const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointModel");
const userModel = require("../models/userModel");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctorId = req.body.userId;
    const doctor = await doctorModel.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(400).send({
        message: "Doctor not found",
        success: false,
      });
    }

    res.status(200).send({
      message: "Doctor information",
      data: doctor,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const updateDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

const getAlldoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    if (!doctors) {
      return res.status(400).send({
        message: "No doctors found",
        success: false,
      });
    }

    res.status(200).send({
      message: "All doctors",
      data: doctors,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor Info fetched",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "getting doctor issue",
      error,
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateDoctorInfoController,
  getAlldoctorsController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
