// PrivateRoute.jsx
import React from 'react';
import { useAuth } from '../UseAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { usuario, rol } = useAuth(); // Obtenemos el usuario y el rol desde el contexto
  const location = useLocation();

  if (!usuario) {
    // Si no hay un usuario autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rol === 'administrador') {
    // Si el rol es administrador, dejar que acceda a la ruta configuracion
    return children;
  }

  if (rol === 'usuario básico') {
    // Si el rol es usuario básico e intenta acceder a /configuracion
    if (location.pathname === '/configuracion') {
      // Mostrar una alerta
      window.alert('No tienes permisos para acceder a esta página. Redirigiendo a la página principal.');
      // Redirigir a la página principal
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (rol === 'sin permisos') {
    // Si no tiene permisos, redirigir a login
    return <Navigate to="/login" replace />;
  }

  // Si el usuario tiene permisos, renderizar el componente hijo
  return children;
};

export default PrivateRoute;


