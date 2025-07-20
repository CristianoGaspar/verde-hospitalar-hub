const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

//  Rota para listar todos os médicos
router.get("/clientes", doctorController.getAllClientes);

//  Rota para criar um médico (sem repetir)
router.post("/clientes", doctorController.createCliente);

//  Rota para contar médicos
router.get("/clientes/quantity", doctorController.countClientes);

module.exports = router;
