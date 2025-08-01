const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

//  Rota para listar todos os médicos
router.get("/doctors", doctorController.getAllDoctors);

//  Rota para criar um médico (sem repetir)
router.post("/doctors", doctorController.createDoctor);

//  Rota para contar médicos
router.get("/doctors/quantity", doctorController.countDoctors);

router.post("/doctors/procedimento", doctorController.createProcedure);

router.post("/doctors/prescriptions", doctorController.createPrescription);

router.post("/doctors/reconsultas", doctorController.createReconsulta);





module.exports = router;
