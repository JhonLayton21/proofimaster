import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const Ventas = () => {
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  return (
    <div className="grid grid-cols-12 gap-0 h-screen">

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 overflow-y-auto">
        <MenuPrincipal 
          correoUsuario={userEmail} 
          showTablaVentas={true} 
          titulo={"VENTAS"} 
          subtitulo={"Seguimiento y control de transacciones"} 
        />
      </div>
    </div>
  );
};

export default Ventas;

