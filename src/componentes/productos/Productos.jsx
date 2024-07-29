import React from "react";
import MenuLateral from "../MenuLateral";
import PaginaProductos from "./PaginaProductos";
import MenuPrincipal from "../MenuPrincipal";

const Productos = () => {
  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* PAGINA PRODUCTOS (incluye MenuPrincipal y TablaProductos) */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal showTablaProductos={true} titulo={"PRODUCTOS"} subtitulo={"Explora tu mercancía"} />
      </div>

    </div>
  );
};

export default Productos;
