import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ rol, permiso, children }) => {
  if (rol === 'admin') {
    return children; // Los admins siempre tienen acceso
  }

  if (rol === 'usuario' && permiso) {
    return children; // Los usuarios normales solo si tienen permiso
  }

  return <Navigate to="/solicitar-permiso" />;
};

export default PrivateRoute;
