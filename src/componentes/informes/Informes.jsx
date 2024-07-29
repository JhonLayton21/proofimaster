import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';

const Informes = () => {
  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal showTablaProductos={false} titulo={"INFORMES"} subtitulo={"Impulsa tu negocio con reportes e informes detallados"} />
      </div>


    </div>
  );
};

export default Informes;
