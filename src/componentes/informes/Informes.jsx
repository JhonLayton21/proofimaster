import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';

const Informes = () => {
  return (
    <div className="grid grid-cols-4 gap-0 h-full">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* MENU PRINCIPAL */}
      <MenuPrincipal showTablaProductos={false} titulo={"INFORMES"} subtitulo={"Impulsa tu negocio con reportes e informes detallados"} />
      
    </div>
  );
};

export default Informes;
