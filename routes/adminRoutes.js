const express = require("express");
const {
  getUsersController,
  getDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/get-users", authMiddleware, getUsersController);
router.post("/get-doctors", authMiddleware, getDoctorsController);
router.post(
  "/change-account-status/:id",
  authMiddleware,
  changeAccountStatusController
);

router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
