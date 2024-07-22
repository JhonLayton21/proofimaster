import React from "react";
import MenuPrincipal from "../MenuPrincipal";

const PaginaClientes= () => {
  return (
    <>
      <MenuPrincipal showTablaClientes={true} titulo="CLIENTES" subtitulo="Gestiona tus clientes y su informacion" />
    </>
  );
};

export default PaginaClientes;