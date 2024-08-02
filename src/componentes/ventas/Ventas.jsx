import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';

const Ventas = () => {
  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal showTablaVentas={true} titulo={"VENTAS"} subtitulo={"Seguimiento y control de transacciones"} />
      </div>


    </div>
  );
};

export default Ventas;
