const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");

const getUsersController = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({ users, success: true });
  } catch (error) {
    res.status(500).send({
      message: `Get Users Controller ${error.message}`,
      success: false,
    });
  }
};

const getDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).send({ doctors, success: true });
  } catch (error) {
    res.status(500).send({
      message: `Get Doctors Controller ${error.message}`,
      success: false,
    });
  }
};

const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

module.exports = {
  getUsersController,
  getDoctorsController,
  changeAccountStatusController,
};
