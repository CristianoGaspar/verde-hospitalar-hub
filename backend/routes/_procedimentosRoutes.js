const express = require("express");
const router = express.Router();
const controllerProcedimentos = require("../controller/procedimentosController"); 

router.get("/procedimentos", controllerProcedimentos.getAllProcedimentos);

module.exports = router;
