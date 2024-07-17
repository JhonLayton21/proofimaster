import React from 'react';
import MenuLateral from '../MenuLateral';
import PaginaClientes from './PaginaClientes';

const Clientes = () => {
  return (
    <div className="grid grid-cols-4 gap-0 h-full">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* MENU PRINCIPAL */}
      <PaginaClientes />

    </div>
  );
};

export default Clientes;
