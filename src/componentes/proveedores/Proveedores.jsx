import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';

const Proveedores = () => {
  return (
    <div className="grid grid-cols-4 gap-0 h-full">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* MENU PRINCIPAL */}
      <MenuPrincipal showTablaProveedores={true} titulo={"PROVEEDORES"} subtitulo={"Conecta tus proveedores de confianza"} />
      
    </div>
  );
};

export default Proveedores;
