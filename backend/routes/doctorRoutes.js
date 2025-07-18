const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/doctors', doctorController.createDoctor);
// Adicione rotas GET, PUT, DELETE aqui também

router.get("/doctors", doctorController.getAllDoctors);


module.exports = router;
