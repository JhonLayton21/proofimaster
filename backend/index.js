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

// Ruta específica para obtener todos los productos con su referencia, marca, proveedor
app.get("/productos", async (req, res) => {
    const query = `
        SELECT 
            p.id,
            p.nombre,
            p.descripcion,
            p.fecha_entrada,
            p.nivel_minimo_stock,
            p.precio_compra,
            p.precio_venta,
            p.stock,
            p.marca_id,
            m.nombre AS marca,
            p.proveedor_id,
            pr.nombre_proveedor AS proveedor,
            p.referencia_id,
            r.codigo AS referencia
        FROM 
            productos p
        JOIN 
            marcas_productos m ON p.marca_id = m.id
        JOIN 
            proveedores pr ON p.proveedor_id = pr.id
        JOIN 
            referencias_productos r ON p.referencia_id = r.id;
    `;
    await executeQuery(query, [], res);
});


// Ruta específica para obtener todos los clientes con su tipo de cliente
app.get("/clientes", async (req, res) => {
    const query = `
        SELECT 
    c.id, 
    c.nombre_cliente, 
    c.direccion_cliente, 
    c.email_cliente, 
    c.telefono_cliente, 
    c.tipo_cliente_id, 
    tc.tipo AS tipo_cliente
FROM 
    clientes c
JOIN 
    tipo_clientes tc 
ON 
    c.tipo_cliente_id = tc.id;

    `;
    await executeQuery(query, [], res);
});

// Ruta específica para obtener todos los proveedores con su metodo de pago
app.get("/proveedores", async (req, res) => {
    const query = `
        SELECT 
    p.id, 
    p.nombre_proveedor, 
    p.contacto_proveedor, 
    p.direccion_proveedor, 
    p.email_proveedor, 
    p.telefono_proveedor, 
    p.metodo_pago_id,
    mp.metodo AS metodo_proveedor
FROM 
    proveedores p
JOIN 
    metodo_pago mp 
ON 
    p.metodo_pago_id = mp.id;

    `;
    await executeQuery(query, [], res);
});

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

