import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';

const Proveedores = () => {
  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal showTablaProveedores={true} titulo={"PROVEEDORES"} subtitulo={"Conecta tus proveedores de confianza"} />
      </div>


    </div>
  );
};

export default Proveedores;
