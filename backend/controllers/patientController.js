const db = require('../db/connection');



exports.getAllClientes = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM cliente");
    
    const formatted = results.map((cliente) => ({
      ...cliente,
      shiftDays: JSON.parse(cliente.shiftDays || "[]")
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
};

exports.countClientes = async (req, res) => {
  try {
    const [result] = await db.query("SELECT count(*) AS total FROM clientes");
    console.log("Resultado da query:", result);
    res.json({ total: result[0].total }); // Agora result[0].total vai funcionar
  } catch (error) {
    console.error("Erro ao buscar quantidade de clientes:", error);
    res.status(500).json({ erro: "Erro ao contar clientes" });
  }
};


exports.createCliente = (req, res) => {
  const {
  id,
  nome,
  data_nascimento,
  cpf,
  possui_convenio,
  convenio_id
  } = req.body;

  const query = `
    INSERT INTO cliente 
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
