const express = require('express');
const cors = require('cors');
const app = express();            //  cria o app primeiro
app.use(cors());                  //  só depois aplica o cors
const mysql = require('mysql2');

app.use(express.json());

// resto do código...


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sua senha, se tiver
  database: 'cwilabsgreen'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// 🔐 NOVA ROTA: Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = `
    SELECT u.id, u.nome, u.sobrenome, p.nome AS perfil
    FROM usuario u
    JOIN perfil p ON u.perfil_id = p.id
    WHERE u.email = ? AND u.senha = ?
  `;

  db.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    // 👇 Veja o que vem do banco
console.log('Usuário autenticado:', results[0]);

    const usuario = results[0];

    // Aqui você pode gerar um token JWT se quiser mais segurança depois
    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      perfil: usuario.perfil
    });
  });
});

// Rota existente (listar usuários)
app.get('/usuarios', (req, res) => {
  const query = `
    SELECT 
      u.id, u.nome, u.sobrenome, u.cpf, u.data_nascimento, 
      u.cargo, p.nome AS perfil, u.ativo, u.data_criacao, u.data_inativacao
    FROM usuario u
    JOIN perfil p ON u.perfil_id = p.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    return res.json(results);
  });
});


//  NOVA ROTA de Doctor
const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api', doctorRoutes);

const patientsRoutes = require('./routes/patientRoutes');
app.use('/api', patientsRoutes);

const appointmentsRoutes = require("./routes/appointmentsRoutes");
app.use("/api/appointments", appointmentsRoutes);

const faturamentoRoutes = require("./routes/faturamentoRoutes");
app.use("/api", faturamentoRoutes);


// Subir o servidor
app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});
