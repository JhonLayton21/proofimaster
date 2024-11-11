import React from 'react';
import { useAuth } from '../UseAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { usuario, rol } = useAuth();
  const location = useLocation(); // Obtiene la ruta actual

  // Si no hay un usuario autenticado
  if (!usuario) {
    alert("No posees permisos suficientes para acceder, contacta al administrador.");
    return <Navigate to="/login" />;
  }

  // Si el rol no ha sido asignado
  if (rol === null) {
    alert("Tu rol no ha sido asignado, por favor inicia sesión de nuevo o contacta al administrador");
    return <Navigate to="/login" />;
  }

  // Redireccionar según el rol del usuario
  if (rol === 'administrador') {
    return children; // Permite acceso completo
  }

  if (rol === 'usuario básico') {
    // Si el usuario básico intenta acceder a 'configuracion'
    if (location.pathname === '/configuracion') {
      alert("No posees permisos suficientes para acceder, contacta al administrador.");
      return <Navigate to="/" />;
    }
    return children; // Permite acceso a otras rutas
  }

  if (rol === 'sin permisos') {
    alert("No tienes permisos, por favor contacta al administrador e intenta iniciar sesión de nuevo");
    return <Navigate to="/login" />;
  }

  // En caso de roles no identificados, redirige a login
  alert("Tu rol no ha sido asignado, por favor contacta al administrador e intenta iniciar sesión de nuevo");
  return <Navigate to="/login" />;
};

export default PrivateRoute;




