import React from "react";
import MenuLateral from "./MenuLateral";
import PaginaProductos from "./PaginaProductos";

const Productos = () => {
  return (
    <div className="grid grid-cols-4 gap-0 h-full">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* PAGINA PRODUCTOS (incluye MenuPrincipal y TablaProductos) */}
      <PaginaProductos />

    </div>
  );
};

export default Productos;
