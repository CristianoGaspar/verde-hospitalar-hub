const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

//  Rota para listar todos os médicos
router.get("/patients", patientController.getAllPatients);

//  Rota para criar um médico (sem repetir)
router.post("/patients", patientController.createPatient);

//  Rota para contar médicos
router.get("/patients/quantity", patientController.countPatients);

router.get("/patients/:id/insurance", patientController.getInsuranceByPatientId);




module.exports = router;
