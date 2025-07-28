// backend/controllers/appointmentController.js
const db = require("../db/connection");

exports.createFaturamentoConsulta = async (req, res) => {
  const { consultaId } = req.params;

  try {
    const [consultaRows] = await db.query(
      `SELECT * FROM consultas WHERE id = ?`,
      [consultaId]
    );
    const consulta = consultaRows[0];
    if (!consulta) return res.status(404).json({ error: "Consulta não encontrada" });

    const [clienteRows] = await db.query(
      `SELECT convenio_id FROM clientes WHERE id = ?`,
      [consulta.paciente_id]
    );
    const cliente = clienteRows[0];
    if (!cliente) return res.status(404).json({ error: "Paciente não encontrado" });

    const [convenioRows] = await db.query(
      `SELECT cnpj FROM convenios WHERE id = ?`,
      [cliente.convenio_id]
    );
    const convenio = convenioRows[0];
    if (!convenio) return res.status(404).json({ error: "Convênio não encontrado" });

    const [doctorRows] = await db.query(
      `SELECT specialty FROM doctors WHERE id = ?`,
      [consulta.medico_id]
    );
    const doctor = doctorRows[0];
    if (!doctor) return res.status(404).json({ error: "Médico não encontrado" });

    const [espRows] = await db.query(
      `SELECT custo_consultas FROM especialidades_medicas WHERE nome = ?`,
      [doctor.specialty]
    );
    const especialidade = espRows[0];
    if (!especialidade) return res.status(404).json({ error: "Especialidade não encontrada" });

    const dataFatura = new Date();
    dataFatura.setDate(dataFatura.getDate() + 30);
    const dataFaturaFormatada = dataFatura.toISOString().slice(0, 10); // yyyy-mm-dd

    await db.query(
      `INSERT INTO faturamento_consultas 
      (paciente_id, medico_id, convenio_id, cnpj_convenio, data_fatura, valor_fatura, cod_consulta)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        consulta.paciente_id,
        consulta.medico_id,
        cliente.convenio_id,
        convenio.cnpj,
        dataFaturaFormatada,
        especialidade.custo_consultas,
        consulta.id
      ]
    );

    res.status(201).json({ message: "Faturamento registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar faturamento:", error);
    res.status(500).json({ error: "Erro ao registrar faturamento" });
  }
};


// gerar a lista de faturamento de consulta basicas
exports.getFaturamentoPorPeriodo = async (req, res) => {
     console.log("Recebido getFaturamentoPorPeriodo com query:", req.query);
  let { dataInicio, dataFim } = req.query;

  // Ajusta o formato para incluir horas no início e fim do dia
  dataInicio = `${dataInicio} 00:00:00`;
  dataFim = `${dataFim} 23:59:59`;

  try {
    const [rows] = await db.query(
      `SELECT f.*, 
              c.nome AS nome_paciente, 
              d.full_name AS nome_medico,
              co.nome AS nome_convenio
       FROM faturamento_consultas f
       JOIN clientes c ON f.paciente_id = c.id
       JOIN doctors d ON f.medico_id = d.id
       JOIN convenios co ON f.convenio_id = co.id
       WHERE f.data_fatura >= ? AND f.data_fatura <= ?
       ORDER BY f.data_fatura ASC`,
      [dataInicio, dataFim]
    );

    console.log("Resultado da consulta:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar faturamento:", error);
    res.status(500).json({ error: "Erro ao buscar faturamento" });
  }
};
