// backend/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.post("/", appointmentsController.createAppointment);

router.get("/insurances", appointmentsController.getInsurances);


// Rota para pegar consultas agendadas (data > hoje + 3)
router.get("/consultas-agendadas", appointmentsController.getConsultasAgendadas);

module.exports = router;
