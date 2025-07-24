// backend/controllers/appointmentController.js
const connection = require("../db/connection");

exports.createAppointment = async (req, res) => {
  const {
    paciente_id,
    medico_id,
    data_agendada,
    status,
    motivo_cancelamento,
    data_finalizacao,
    observacoes,
  } = req.body;

  try {
    const [result] = await connection.execute(
      `INSERT INTO consultas (paciente_id, medico_id, data_agendada, status, motivo_cancelamento, data_finalizacao, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        paciente_id,
        medico_id,
        data_agendada,
        status,
        motivo_cancelamento || null,
        data_finalizacao || null,
        observacoes || null,
      ]
    );

    res.status(201).json({ id: result.insertId, message: "Consulta criada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    res.status(500).json({ error: "Erro interno ao criar consulta" });
  }
};



exports.getInsurances = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT DISTINCT nome FROM convenios order by nome asc");
    const nomes = rows.map(row => row.nome);

    console.log("Nomes encontrados:", nomes);
  //      console.log("Dados de convênios:", data); // 👈 log direto aqui
    res.json(nomes);
  } catch (error) {
    console.error("Erro ao buscar convênios:", error);
    res.status(500).json({ error: error.message });
  }
};

