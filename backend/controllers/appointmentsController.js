// backend/controllers/appointmentController.js
const db = require("../db/connection");

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
    const [result] = await db.execute(
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
    const [rows] = await db.query("SELECT DISTINCT nome FROM convenios ORDER BY nome ASC");
    const nomes = rows.map(row => row.nome);
    res.json(nomes);
  } catch (error) {
    console.error("Erro ao buscar convênios:", error);
    res.status(500).json({ error: error.message });
  }
};

//serve para listar todas as consultas agendadas com ref data atual com d3+
exports.getConsultasAgendadas = async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      and c.status != 'finalizada'
      ORDER BY c.data_agendada ASC;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar consultas agendadas:", error);
    res.status(500).json({ error: error.message });
  }
};

//consulta a quantidade de consultas que não estão com status de "realizada,cancelada e finalizada"
exports.countPendingAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM consultas WHERE status != 'realizada' and  status != 'cancelada' and  status != 'finalizada'"  
    );
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Erro ao contar consultas pendentes:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
};

//consulta a quantidade de consultas que não estão com status de "agendada"
exports.countPendingAppointmentsConfirmed = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM consultas WHERE status = 'agendada' "  
    );
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Erro ao contar consultas pendentes:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
};


//consulta a quantidade de consultas que não estão com status de "cancelada"
exports.countPendingAppointmentsCancelled = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM consultas WHERE status = 'cancelada' "  
    );
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Erro ao contar consultas pendentes:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
};

exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, status, data_agendada, motivo_cancelamento, data_finalizacao FROM consultas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar consulta:", error);
    res.status(500).json({ error: "Erro interno ao buscar consulta" });
  }
};

{/*
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    data_finalizacao,
    motivo_cancelamento,
    consulta_finalizada
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE consultas 
       SET status = ?, 
           data_finalizacao = ?, 
           motivo_cancelamento = ?, 
           consulta_finalizada = ?
       WHERE id = ?`,
      [status, data_finalizacao, motivo_cancelamento, consulta_finalizada, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    res.json({ message: "Consulta atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
*/}

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    data_finalizacao,
    motivo_cancelamento,
    consulta_finalizada
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE consultas 
       SET status = ?, 
           data_finalizacao = ?, 
           motivo_cancelamento = ?, 
           consulta_finalizada = ?
       WHERE id = ?`,
      [status, data_finalizacao, motivo_cancelamento, consulta_finalizada, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    // 👉 Se a consulta foi realizada, gera faturamento
    if (status === "finalizada") {
      const [consultaRows] = await db.query(`SELECT * FROM consultas WHERE id = ?`, [id]);
      const consulta = consultaRows[0];

      const [clienteRows] = await db.query(
        `SELECT convenio_id FROM clientes WHERE id = ?`,
        [consulta.paciente_id]
      );
      const cliente = clienteRows[0];

      const [convenioRows] = await db.query(
        `SELECT cnpj FROM convenios WHERE id = ?`,
        [cliente.convenio_id]
      );
      const convenio = convenioRows[0];

      const [doctorRows] = await db.query(
        `SELECT specialty FROM doctors WHERE id = ?`,
        [consulta.medico_id]
      );
      const doctor = doctorRows[0];

      const [espRows] = await db.query(
        `SELECT custo_consultas FROM especialidades_medicas WHERE nome = ?`,
        [doctor.specialty]
      );
      const especialidade = espRows[0];

      const dataFatura = new Date();
      dataFatura.setDate(dataFatura.getDate() + 30);
      const dataFaturaFormatada = dataFatura.toISOString().slice(0, 10); // yyyy-mm-dd

      await db.query(
        `INSERT INTO faturamento_consultas 
        (paciente_id, medico_id, convenio_id, cnpj_convenio, data_fatura, valor_fatura, cod_consulta, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          consulta.paciente_id,
          consulta.medico_id,
          cliente.convenio_id,
          convenio.cnpj,
          dataFaturaFormatada,
          especialidade.custo_consultas,
          consulta.id,
          "Pendente"
        ]
      );
    }

    res.json({ message: "Consulta atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


