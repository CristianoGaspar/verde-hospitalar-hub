const db = require('../db/connection');

exports.createDoctor = async (req, res) => {
  const {
    full_name, crm, specialty, email, phone,
    status, entry_time, exit_time, shift_days
  } = req.body;

  try {
    await db.query(
      "INSERT INTO doctors (full_name, crm, specialty, email, phone, status, entry_time, exit_time, shift_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [full_name, crm, specialty, email, phone, status, entry_time, exit_time, JSON.stringify(shift_days)]
    );
    res.status(201).json({ message: "Médico cadastrado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar médico." });
  }
};

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

