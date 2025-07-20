const db = require('../db/connection');



exports.getAllDoctors = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM doctors");
    
    const formatted = results.map((doctor) => ({
      ...doctor,
      shiftDays: JSON.parse(doctor.shiftDays || "[]")
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar médicos:", err);
    res.status(500).json({ erro: "Erro ao buscar médicos" });
  }
};

exports.countDoctors = async (req, res) => {
  try {
    const [result] = await db.query("SELECT count(*) AS total FROM doctors");
    console.log("Resultado da query:", result);
    res.json({ total: result[0].total }); // Agora result[0].total vai funcionar
  } catch (error) {
    console.error("Erro ao buscar quantidade de médicos:", error);
    res.status(500).json({ erro: "Erro ao contar médicos" });
  }
};


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
    JSON.stringify(shiftDays), // muito importante
    entryTime,
    exitTime
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR NO BANCO:", err); // ← esse log é chave
      return res.status(500).json({ error: "Erro ao cadastrar médico" });
    }

    console.log("✅ Médico inserido com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Médico cadastrado com sucesso",
    });
  });
};
