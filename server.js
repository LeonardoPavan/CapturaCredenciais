const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Configuração do banco de dados SQLite
const db = new sqlite3.Database(path.join(__dirname, 'db', 'banco.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Definindo uma rota principal
app.get('/', (req, res) => {
  res.send('Olá, Mundo! Seu servidor está funcionando.');
});

// Exemplo de rota para recuperar dados do banco de dados
app.get('/dados', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
      res.status(500).send('Erro ao acessar o banco de dados.');
      console.error(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Rota para capturar credenciais (como exemplo)
app.post('/captura-credenciais', (req, res) => {
  const { usuario, senha } = req.body; // Supondo que você está enviando as credenciais via POST
  if (usuario && senha) {
    // Simulando o armazenamento no banco de dados
    db.run('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)', [usuario, senha], (err) => {
      if (err) {
        res.status(500).send('Erro ao salvar as credenciais.');
        console.error(err.message);
      } else {
        res.status(200).send('Credenciais capturadas com sucesso.');
      }
    });
  } else {
    res.status(400).send('Faltando dados de usuário ou senha.');
  }
});

// Rota de fallback para lidar com rotas não encontradas
app.get('*', (req, res) => {
  res.status(404).send('Página não encontrada');
});

// Definindo a porta em que o servidor será executado
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
