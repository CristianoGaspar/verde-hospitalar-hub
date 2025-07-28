// backend/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.post("/", appointmentsController.createAppointment);

router.get("/insurances", appointmentsController.getInsurances);


// Rota para pegar consultas agendadas (data > hoje + 3)
router.get("/consultas-agendadas", appointmentsController.getConsultasAgendadas);

router.get("/count/pending", appointmentsController.countPendingAppointments);

//// rota que busca uma consulta por ID
router.get("/:id", appointmentsController.getAppointmentById);

//rota para atualizar uma consulta
router.put("/:id", appointmentsController.updateAppointment);

router.get("/count/confirmed", appointmentsController.countPendingAppointmentsConfirmed);

router.get("/count/cancelled", appointmentsController.countPendingAppointmentsCancelled);





module.exports = router;
