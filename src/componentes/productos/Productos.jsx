import React from "react";
import MenuLateral from "../MenuLateral";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const Productos = () => {
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  return (
    <div className="grid grid-cols-12 gap-0 h-full">
      {/* MENU LATERAL */}
      <div className="md:col-span-2">
        <MenuLateral />
      </div>

      {/* PAGINA PRODUCTOS (incluye MenuPrincipal y TablaProductos) */}
      <div className="col-span-12 md:col-span-10">
        <MenuPrincipal 
          correoUsuario={userEmail} 
          showTablaProductos={true} 
          titulo={"PRODUCTOS"} 
          subtitulo={"Explora tu mercancía"} 
        />
      </div>
    </div>
  );
};

export default Productos;
