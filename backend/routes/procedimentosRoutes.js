const express = require("express");
const router = express.Router();
const procedimentosController = require("../controllers/procedimentosController");


router.get("/procedimentos", procedimentosController.getAllProcedimentos);
module.exports = router;