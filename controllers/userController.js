const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointModel");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const userExisting = await userModel.findOne({ email: req.body.email });
    if (userExisting) {
      return res
        .status(200)
        .send({ message: "User already exits", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    const isPasswordMatvh = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatvh) {
      return res.status(200).send({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .send({ message: "Login Successfully", success: true, token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error in login controller ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    // Ensure you're getting the userId from the request body
    const userId = req.body.userId;

    // Check if userId is provided
    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID is required", success: false });
    }

    // Find the user by ID
    const user = await userModel.findById(userId); // Use findById for cleaner syntax

    // Check if user was found
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // If user is found, exclude the password from the response
    user.password = undefined; // Set password to undefined to avoid sending it

    // Return success response with user data
    return res.status(200).send({
      success: true,
      data: user, // user is returned without the password
    });
  } catch (error) {
    console.error("Error in authController: ", error); // Log the error
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "all notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in notifications",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationsController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.seennotification = [];
    user.notification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      data: updatedUser,
      message: "all notifications are deleted",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in notifications",
      success: false,
      error,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-Appointment-Request",
      message: `You have a new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();
    res.status(201).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in booking appointment",
      error,
    });
  }
};

const bookingAvailibilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();

    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const doctorId = req.body.doctorId;

    const appointment = await appointmentModel.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointment.length > 0) {
      res.status(200).send({
        success: true,
        message: "Doctor is not available at this time",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Doctor is available at this time",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in booking availibility",
      error,
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in user appointments",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationsController,
  bookAppointmentController,
  bookingAvailibilityController,
  userAppointmentsController,
};
