import express from "express";
import pool from './db.js';
import cors from 'cors';

const app = express();

//middleware
app.use(cors());
app.use(express.json()); //req.body

// Función genérica para realizar consultas SQL
const executeQuery = async (query, params, res) => {
    try {
        const result = await pool.query(query, params);
        return res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};

// Rutas genéricas para obtener todos los registros de cualquier tabla
app.get("/:table", async (req, res) => {
    const { table } = req.params;
    const query = `SELECT * FROM ${table}`;
    await executeQuery(query, [], res);
});

// Ruta genérica para obtener un registro por ID de cualquier tabla
app.get("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    await executeQuery(query, [id], res);
});

// Ruta genérica para crear un registro en cualquier tabla
app.post("/:table", async (req, res) => {
    const { table } = req.params;
    const columns = Object.keys(req.body).join(", ");
    const values = Object.values(req.body);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    await executeQuery(query, values, res);
});

// Ruta genérica para actualizar un registro en cualquier tabla
app.put("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const columns = Object.keys(req.body).map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(req.body);
    const query = `UPDATE ${table} SET ${columns} WHERE id = $${values.length + 1} RETURNING *`;
    await executeQuery(query, [...values, id], res);
});

// Ruta genérica para eliminar un registro en cualquier tabla
app.delete("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const query = `DELETE FROM ${table} WHERE id = $1`;
    await executeQuery(query, [id], res);
});

app.listen(5000, () => {
    console.log("Servidor corriendo en el puerto 5000");
});
