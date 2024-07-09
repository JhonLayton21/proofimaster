import express from 'express';
import pool from "../src/db.js";
//const pool = require('./db'); // Asegúrate de que 'db.js' exporta 'pool' correctamente
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware para parsear JSON

app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
