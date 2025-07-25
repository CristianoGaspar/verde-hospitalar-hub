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

   // console.log("Nomes encontrados:", nomes);
  //      console.log("Dados de convênios:", data); // 👈 log direto aqui
    res.json(nomes);
  } catch (error) {
    console.error("Erro ao buscar convênios:", error);
    res.status(500).json({ error: error.message });
  }
};

//serve para listar todas as consultas agendadas com ref data atual com d3+
exports.getConsultasAgendadas = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        c.id AS consulta_id, 
        c.data_agendada, 
        c.status, 
        cli.nome AS nome_cliente, 
        d.full_name AS nome_medico, 
        conv.nome AS nome_convenio 
      FROM consultas c 
      JOIN clientes cli ON cli.id = c.paciente_id 
      JOIN doctors d ON d.id = c.medico_id 
      LEFT JOIN convenios conv ON conv.id = cli.convenio_id 
      WHERE c.data_agendada > DATE_ADD(CURDATE(), INTERVAL 3 DAY) 
      ORDER BY c.data_agendada ASC;
    `);

    console.log("Consultas encontradas:", rows);

    res.json(rows); // envia tudo direto
  } catch (error) {
    console.error("Erro ao buscar consultas agendadas:", error);
    res.status(500).json({ error: error.message });
  }
};
