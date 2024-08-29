import React from 'react';
import MenuLateral from '../MenuLateral';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const Proveedores = () => {
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  return (
    <div className="grid grid-cols-12 gap-0 h-full">

      {/* MENU PRINCIPAL */}
      <div className="col-span-12">
        <MenuPrincipal 
          correoUsuario={userEmail} 
          showTablaProveedores={true} 
          titulo={"PROVEEDORES"} 
          subtitulo={"Conecta tus proveedores de confianza"} 
        />
      </div>
    </div>
  );
};

export default Proveedores;

