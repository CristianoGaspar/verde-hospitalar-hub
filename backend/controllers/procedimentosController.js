// backend/controllers/appointmentController.js
const db = require("../db/connection");


//serve para listar todas as consultas agendadas com ref data atual com d3+
exports.getAllProcedimentos = async (req, res) => {
  try {
    const query = `
      SELECT * FROM procedimentos_agendados
    `;
    const [result] = await db.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar procedimentos:", error);
    res.status(500).json({ erro: "Erro ao buscar procedimentos" });
  }
};

