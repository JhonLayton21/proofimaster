import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App.jsx';
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
import './credenciales.js';
import PrivateRoute from './componentes/PrivateRoute.jsx';

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
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
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
    path: 'productos',
    element: <Productos2 />,
    errorElement: <ErrorPage />
  },
  {
    path: 'ventas',
    element: <Ventas2 />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'proveedores',
    element: <Proveedores2 />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'clientes',
    element: <Clientes2 />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'metodos-pago',
    element: <MetodosPago />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'marca-productos',
    element: <MarcaProductos />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'referencia-productos',
    element: <ReferenciaProductos />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'tipo-clientes',
    element: <TipoClientes />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'estados-venta',
    element: <EstadosVenta />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'metodo-envio-venta',
    element: <MetodoEnvioVenta />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'informes',
    element: <Informes />,
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

