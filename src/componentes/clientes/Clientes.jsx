import React from 'react';
import MenuLateral from '../MenuLateral';
import PaginaClientes from './PaginaClientes';
import MenuPrincipal from '../MenuPrincipal';

const Clientes = () => {
  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal showTablaClientes={true} titulo="CLIENTES" subtitulo="Gestiona tus clientes y su informacion" />
      </div>


    </div>
  );
};

export default Clientes;
