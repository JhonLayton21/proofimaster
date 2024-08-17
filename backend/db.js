import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user:"jhon",
    password: "2110",
    host: "localhost",
    port: 5432,
    database: "proofimaster"
})

pool.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      process.exit(1); // Salir de la aplicación si hay un error
    } else {
      console.log('Conexión exitosa');
    }
  });

export default pool;

