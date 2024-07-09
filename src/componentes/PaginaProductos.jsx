// PaginaProductos.jsx
import React, { useEffect, useState } from "react";
import MenuPrincipal from "./MenuPrincipal";
import { pool } from "../db"; // Importación nombrada

const PaginaProductos = () => {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await pool.query('SELECT * FROM productos');
      setProductos(res.data);
      console.log(res.data); // Accede a los datos usando res.data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <MenuPrincipal showTablaProductos={true} />
      {/* Puedes agregar código aquí para mostrar los productos */}
    </>
  );
};

export default PaginaProductos;

