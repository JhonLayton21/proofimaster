import { useAuth } from '../UseAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { usuario, rol, loading } = useAuth();
  const location = useLocation(); // Obtiene la ruta actual

  if (loading) {
    // Puedes mostrar un spinner o un mensaje de carga mientras se obtiene el usuario y rol
    return <div>Cargando...</div>;
  }

  if (!usuario) {
    alert("No posees permisos suficientes para acceder, contacta al administrador.");
    return <Navigate to="/login" />;
  }

  if (rol === null) {
    alert("Tu rol no ha sido asignado, por favor inicia sesión de nuevo o contacta al administrador");
    return <Navigate to="/login" />;
  }

  // Si el usuario es admin, tiene acceso a todas las rutas
  if (rol === 'admin') {
    return children;
  }

  // Si el usuario es de tipo 'user' y está intentando acceder a 'configuracion'
  if (rol === 'user' && location.pathname === '/configuracion') {
    return <Navigate to="/" />;
  }

  // Si es 'user' y no intenta acceder a 'configuracion', permite el acceso
  if (rol === 'user') {
    return children;
  }

  // En caso de roles no identificados, redirige a 'solicitar-permiso'
  return <Navigate to="/solicitar-permiso" />;
};

export default PrivateRoute;



