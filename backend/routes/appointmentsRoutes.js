// backend/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.post("/", appointmentsController.createAppointment);

router.get("/insurances", appointmentsController.getInsurances);



module.exports = router;
