import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const Informes = () => {
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU PRINCIPAL */}
      <div className="col-span-12">
        <MenuPrincipal 
          correoUsuario={userEmail} 
          showTablaProductos={false} 
          titulo={"INFORMES"} 
          subtitulo={"Impulsa tu negocio con reportes e informes detallados"} 
        />
      </div>
    </div>
  );
};

export default Informes;

