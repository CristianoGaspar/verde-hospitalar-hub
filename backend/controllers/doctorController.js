const db = require('../db/connection');

// 🔍 Listar médicos
exports.getAllDoctors = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM doctors");
    
    const formatted = results.map((doctor) => ({
      ...doctor,
      shiftDays: JSON.parse(doctor.shift_days || "[]"),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar médicos:", err);
    res.status(500).json({ erro: "Erro ao buscar médicos" });
  }
};

// 📊 Contar médicos
exports.countDoctors = async (req, res) => {
  try {
    const [result] = await db.query("SELECT count(*) AS total FROM doctors");
    console.log("Resultado da query:", result);
    res.json({ total: result[0].total });
  } catch (error) {
    console.error("Erro ao buscar quantidade de médicos:", error);
    res.status(500).json({ erro: "Erro ao contar médicos" });
  }
};

// ➕ Cadastrar médico
exports.createDoctor = (req, res) => {
  const {
    full_name,
    crm,
    specialty,
    email,
    phone,
    status,
    shiftDays,
    entryTime,
    exitTime
  } = req.body;

  const query = `
    INSERT INTO doctors 
    (full_name, crm, specialty, email, phone, status, shift_days, entry_time, exit_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    full_name,
    crm,
    specialty,
    email,
    phone,
    status,
    JSON.stringify(shiftDays),
    entryTime,
    exitTime
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR MÉDICO:", err);
      return res.status(500).json({ error: "Erro ao cadastrar médico" });
    }

    console.log("✅ Médico inserido com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Médico cadastrado com sucesso",
    });
  });
};

// 🏥 Cadastrar procedimento (ajustado)
exports.createProcedure = (req, res) => {
  //console.log("📥 Dados recebidos para criar procedimento:", req.body);

  const {
    paciente_id,
    medico_id,
    procedimento_codigo,
    nome_procedimento,
    nome_especialidade,
    tipo,
    data_agendada,
    hora_procedimento,
    status,
    convenio,
    observacoes
  } = req.body;

  const query = `
    INSERT INTO procedimentos_agendados 
    (paciente_id, medico_id, procedimento_codigo, nome_procedimento, nome_especialidade, tipo, data_agendada, hora_procedimento, status, data_realizacao, convenio, motivo_cancelamento, observacoes, leito)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    paciente_id,
    medico_id,
    procedimento_codigo,
    nome_procedimento,
    nome_especialidade,
    tipo,
    data_agendada,
    hora_procedimento,
    status,
    null,
    convenio,
    "em_aberto",
    observacoes,
    "a_definir"
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR PROCEDIMENTO:", err);
      return res.status(500).json({ error: "Erro ao salvar procedimento" });
    }

    console.log("✅ Procedimento inserido com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Procedimento agendado com sucesso",
    });
  });
};


exports.createPrescription = (req, res) => {
  console.log("📥 Dados recebidos para criar receituário:", req.body);

  const {
    paciente_id,
    medico_id,
    convenio,
    cod_medicamento,
    nome_medicamento,
    posologia,
    quantidade,
    quantidade_dias_retorno,
    apresentar_exames,
    data_receita,
    status,
    observacoes
  } = req.body;

  const query = `
    INSERT INTO receituarios_medicos 
    (paciente_id, medico_id, convenio, cod_medicamento, nome_medicamento, posologia, quantidade, quantidade_dias_retorno, apresentar_exames, data_receita, status, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    paciente_id,
    medico_id,
    convenio,
    cod_medicamento,
    nome_medicamento,
    posologia,
    quantidade,
    quantidade_dias_retorno,
    apresentar_exames,
    data_receita,
    status,
    observacoes
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR RECEITUÁRIO:", err);
      return res.status(500).json({ error: "Erro ao salvar receituário" });
    }

    console.log("✅ Receituário inserido com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Receituário cadastrado com sucesso",
    });
  });
};


exports.createReconsulta = (req, res) => {
  console.log("📥 Dados recebidos para criar reconsulta:", req.body);

  const {
    paciente_id,
    medico_id,
    convenio,
    tipo_reconsulta,
    quantidade,
    observacoes
  } = req.body;

  const query = `
    INSERT INTO reconsultas_medicas 
    (paciente_id, medico_id, convenio, tipo_reconsulta, quantidade, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    paciente_id,
    medico_id,
    convenio,
    tipo_reconsulta,
    quantidade,
    observacoes || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR RECONSULTA:", err);
      return res.status(500).json({ error: "Erro ao salvar reconsulta" });
    }

    console.log("✅ Reconsulta inserida com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Reconsulta criada com sucesso",
    });
  });
};
