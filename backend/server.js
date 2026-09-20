const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool(process.env.MYSQL_URL, {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        return;
    }

    console.log('Conexão com o banco de dados agosto_lilas estabelecida com sucesso!');

    connection.release();
});

// --- NOVAS ROTAS AQUI ---

// Rota POST: Recebe os dados do formulário e salva no banco
app.post('/denuncias', (req, res) => {
    // Pega as informações enviadas pelo frontend
    const { tipo_agressao, quem_agredida, cidade, bairro, rua, latitude, longitude, descricao } = req.body;

    // Comando SQL para inserir na tabela
    const sql = `INSERT INTO denuncias (tipo_agressao, quem_agredida, cidade, bairro, rua, latitude, longitude, descricao)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const valores = [tipo_agressao, quem_agredida, cidade, bairro, rua, latitude, longitude, descricao];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao salvar denúncia:', err);
            return res.status(500).json({ erro: 'Erro ao salvar no banco de dados' });
        }
        res.status(201).json({ mensagem: 'Denúncia registrada com sucesso!', id: result.insertId });
    });
});

// Rota GET: Pega todas as denúncias do banco para mostrar no frontend (mapa/gráficos)
app.get('/denuncias', (req, res) => {
    const sql = 'SELECT * FROM denuncias ORDER BY data_criacao DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('ERRO MYSQL - GET /denuncias');
            console.error('Mensagem:', err.message);
            console.error('Código:', err.code);
            console.error('Número:', err.errno);
            console.error('SQL State:', err.sqlState);
            console.error('Stack:', err.stack);

            return res.status(500).json({
                erro: 'Erro ao buscar no banco de dados',
                mensagem: err.message || null,
                codigo: err.code || null,
                numero: err.errno || null,
                sqlState: err.sqlState || null
            });
        }

        console.log('GET /denuncias - registros encontrados:', results.length);

        res.json(results);
    });
});

// ------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});