const express = require("express");
const router = express.Router();
const faturasController = require("../controllers/faturamentoController");

router.post("/faturamento-consulta/:consultaId", faturasController.createFaturamentoConsulta);

// Lista de faturas por período
router.get("/faturamento-consulta", faturasController.getFaturamentoPorPeriodo);

module.exports = router;
