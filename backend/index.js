import express from "express";
import pool from './db.js';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Permite leer JSON en req.body

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

// Ruta específica para obtener todos las ventas con sus datos relacionales
app.get("/ventas", async (req, res) => {
    const query = `
        SELECT 
            v.id, 
            v.fecha_venta,  
            v.descuento_venta, 
            v.nota_venta, 
            v.subtotal,
            v.total,
            c.nombre_cliente AS cliente,
            ev.estado AS estado,
            mp.metodo AS metodo_pago,
            me.metodo AS metodo_envio,
            json_agg(p.nombre) AS productos 
        FROM 
            ventas v
        JOIN 
            clientes c ON v.cliente_id = c.id
        JOIN
            estado_venta ev ON v.estado_venta_id = ev.id 
        JOIN
            metodo_pago mp ON v.metodo_pago_id = mp.id
        JOIN
            metodo_envio_venta me ON v.metodo_envio_venta_id = me.id
        JOIN
            venta_productos vp ON v.id = vp.venta_id
        JOIN
            productos p ON vp.producto_id = p.id 
        GROUP BY
            v.id, c.nombre_cliente, ev.estado, mp.metodo, me.metodo
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
            tipo_clientes tc ON c.tipo_cliente_id = tc.id;
    `;
    await executeQuery(query, [], res);
});


// Ruta específica para obtener todos los proveedores con su método de pago
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
            metodo_pago mp ON p.metodo_pago_id = mp.id;
    `;
    await executeQuery(query, [], res);
});


// Ruta para insertar una venta y los productos asociados
app.post("/crearVenta", async (req, res) => {
    const client = await pool.connect(); // Conexión transaccional
    try {
        const { venta, productos } = req.body;
        console.log("Datos recibidos:", productos);


        // Inicia una transacción
        await client.query('BEGIN');

        // Inserta la venta
        const ventaQuery = `
            INSERT INTO ventas (precio_venta, cliente_id, fecha_venta, estado_venta_id, metodo_pago_id, descuento_venta, nota_venta, metodo_envio_venta_id, subtotal, total)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING id;
        `;
        const ventaValues = [
            venta.precio_venta,
            venta.cliente_id,
            venta.fecha_venta,
            venta.estado_venta_id,
            venta.metodo_pago_id,
            venta.descuento_venta,
            venta.nota_venta,
            venta.metodo_envio_venta_id,
            venta.subtotal,
            venta.total,
        ];
        
        const ventaResult = await client.query(ventaQuery, ventaValues);
        const ventaId = ventaResult.rows[0].id;

        // Inserta los productos relacionados a la venta
        const productoQuery = `
            INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio)
            VALUES ($1, $2, $3, $4);
        `;

        for (const prod of productos) {
            const productoValues = [
                ventaId,          // Relación de venta
                prod.producto_id, // ID del producto
                prod.cantidad,    // Cantidad vendida
                prod.precio       // Precio del producto
            ];

            console.log("Valores de producto:", productoValues);
            await client.query(productoQuery, productoValues);
        }

        // Confirma la transacción
        await client.query('COMMIT');
        res.json({ message: "Venta y productos insertados correctamente", ventaId });

    } catch (err) {
        // Reversa la transacción si ocurre un error
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Error al crear la venta');
    } finally {
        client.release();
    }
});

// Ruta para obtener los productos de una venta
app.get("/venta_productos/:ventaId", async (req, res) => {
    const { ventaId } = req.params;
    try {
        const result = await pool.query(`
            SELECT producto_id, cantidad, precio
            FROM venta_productos
            WHERE venta_id = $1
        `, [ventaId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos de la venta');
    }
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

// Iniciar el servidor
app.listen(5000, () => {
    console.log("Servidor corriendo en el puerto 5000");
});
