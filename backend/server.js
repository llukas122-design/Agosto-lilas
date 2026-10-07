
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o pool do banco de dados estabelecida com sucesso!');
    connection.release(); // É importante liberar a conexão de volta para o pool
});

app.post('/denuncias', (req, res) => {
    const {
        tipo_agressao,
        quem_agredida,
        cidade,
        bairro,
        rua,
        latitude,
        longitude,
        descricao
    } = req.body;

    const sql = `
        INSERT INTO denuncias
        (tipo_agressao, quem_agredida, cidade, bairro, rua, latitude, longitude, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        tipo_agressao,
        quem_agredida,
        cidade,
        bairro,
        rua,
        latitude,
        longitude,
        descricao
    ];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Erro ao salvar denúncia:', err);
            return res.status(500).json({
                erro: 'Erro ao salvar no banco de dados'
            });
        }

        res.status(201).json({
            mensagem: 'Denúncia registrada com sucesso!',
            id: result.insertId
        });
    });
});

app.get('/denuncias', (req, res) => {
    const sql = 'SELECT * FROM denuncias ORDER BY data_criacao DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar denúncias:', err);
            return res.status(500).json({
                erro: 'Erro ao buscar no banco de dados'
            });
        }

        res.json(results);
    });
});

app.get('/delegacias', (req, res) => {
    const sql = 'SELECT * FROM delegacias';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar delegacias:', err);

            return res.status(500).json({
                erro: 'Erro ao buscar delegacias'
            });
        }

        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});

