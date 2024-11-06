import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App.jsx';
import SignUp from './componentes/SignUp.jsx';
import Login from './componentes/Login.jsx';
import ErrorPage from './paginaError.jsx';
import Configuracion from './componentes/Configuracion.jsx';
import Ventas2 from './componentes/ventas/Ventas2.jsx';
import Clientes2 from './componentes/clientes/Clientes2.jsx';
import Proveedores2 from './componentes/proveedores/Proveedores2.jsx';
import Productos2 from './componentes/productos/Productos2.jsx';
import EstadosVenta from './componentes/categorias/EstadosVenta.jsx';
import MarcaProductos from './componentes/categorias/MarcaProductos.jsx';
import MetodoEnvioVenta from './componentes/categorias/MetodoEnvioVenta.jsx';
import MetodosPago from './componentes/categorias/MetodosPago.jsx';
import ReferenciaProductos from './componentes/categorias/ReferenciaProductos.jsx';
import TipoClientes from './componentes/categorias/TipoClientes.jsx';
import Informes from './componentes/informes/Informes.jsx';
import SolicitarPermiso from './componentes/SolicitarPermiso.jsx';
import './index.css';
import PrivateRoute from './componentes/PrivateRoute.jsx';
import UpdatePassword from './componentes/UpdatePassword.jsx';
import HistorialCambios from './componentes/auditoriaCambios/HistorialCambios.jsx';

// IMPORTAR ENRUTAMIENTO
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// IMPORTAR EL CONTEXTO DE AUTENTICACIÓN
import { AuthProvider, useAuth } from './UseAuth.jsx';
import { elements } from 'chart.js';

// DEFINIR RUTAS PARA PÁGINAS
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'solicitar-permiso',
    element: <SolicitarPermiso />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'restablecer-contraseña',
    element: <UpdatePassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'signup',
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  // RUTAS PROTEGIDAS POR PrivateRoute
  {
    path: 'configuracion',
    element: (
      <PrivateRoute>
        <Configuracion />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'historial',
    element: (
      <PrivateRoute>
        <HistorialCambios />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'productos',
    element: (
      <PrivateRoute>
        <Productos2 />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'ventas',
    element: (
      <PrivateRoute>
        <Ventas2 />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'proveedores',
    element: (
      <PrivateRoute>
        <Proveedores2 />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'clientes',
    element: (
      <PrivateRoute>
        <Clientes2 />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'metodos-pago',
    element: (
      <PrivateRoute>
        <MetodosPago />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'marca-productos',
    element: (
      <PrivateRoute>
        <MarcaProductos />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'referencia-productos',
    element: (
      <PrivateRoute>
        <ReferenciaProductos />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'tipo-clientes',
    element: (
      <PrivateRoute>
        <TipoClientes />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'estados-venta',
    element: (
      <PrivateRoute>
        <EstadosVenta />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'metodo-envio-venta',
    element: (
      <PrivateRoute>
        <MetodoEnvioVenta />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'informes',
    element: (
      <PrivateRoute>
        <Informes />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

// ENVOLVER LA APLICACIÓN EN EL PROVEEDOR DE AUTENTICACIÓN
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);

