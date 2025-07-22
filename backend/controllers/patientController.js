const db = require('../db/connection');



exports.getAllPatients = async (req, res) => {
  try {
    const [results] = await db.query("SELECT c.id AS cliente_id, c.nome AS nome_cliente, c.convenio_id as conveio_id, c.data_nascimento, c.cpf as cpf, v.nome AS nome_convenio FROM clientes c LEFT JOIN convenios v ON c.convenio_id = v.id WHERE 1 order by nome_cliente asc;");
    
    const formatted = results.map((patient) => ({
      ...patient,
      shiftDays: JSON.parse(patient.shiftDays || "[]")
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
};

exports.countPatients = async (req, res) => {
  try {
    const [result] = await db.query("SELECT count(*) AS total FROM clientes");
    console.log("Resultado da query:", result);
    res.json({ total: result[0].total }); // Agora result[0].total vai funcionar
  } catch (error) {
    console.error("Erro ao buscar quantidade de clientes:", error);
    res.status(500).json({ erro: "Erro ao contar clientes" });
  }
};


exports.createPatient = (req, res) => {
  const {
  id,
  nome,
  data_nascimento,
  cpf,
  possui_convenio,
  convenio_id
  } = req.body;

  const query = `
    INSERT INTO clientes 
    (id,  nome,  data_nascimento,  cpf,  possui_convenio,  convenio_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
  id,
  nome,
  data_nascimento,
  cpf,
  possui_convenio,
  convenio_id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ ERRO AO INSERIR NO BANCO:", err); // ← esse log é chave
      return res.status(500).json({ error: "Erro ao cadastrar cliente" });
    }

    console.log("✅ Cliente inserido com ID:", result.insertId);
    return res.status(201).json({
      id: result.insertId,
      message: "Cliente cadastrado com sucesso",
    });
  });
};
