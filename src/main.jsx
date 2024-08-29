import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App.jsx';
import Login from './componentes/Login.jsx';
import ErrorPage from './paginaError.jsx';
import Configuracion from './componentes/Configuracion.jsx';
import Productos from './componentes/productos/Productos.jsx';
import Ventas from './componentes//ventas/Ventas.jsx';
import Proveedores from './componentes/proveedores/Proveedores.jsx';
import Clientes from './componentes/clientes/Clientes.jsx';
import EstadosVenta from './componentes/categorias/EstadosVenta.jsx';
import MarcaProductos from './componentes/categorias/MarcaProductos.jsx';
import MetodoEnvioVenta from './componentes/categorias/MetodoEnvioVenta.jsx';
import MetodosPago from './componentes/categorias/MetodosPago.jsx';
import ReferenciaProductos from './componentes/categorias/ReferenciaProductos.jsx';
import TipoClientes from './componentes/categorias/TipoClientes.jsx';
import Informes from './componentes/informes/Informes.jsx';
import Root from './rutas/Root.jsx';
import './index.css';
import './credenciales.js';

//IMPORTACIONES PARA ENRUTAMIENTO
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

//DEFINIR RUTAS PARA PAGINAS
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'configuracion',
    element: <Configuracion />,
  },
  {
    path: 'productos',
    element: <Productos />,
  },
  {
    path: 'ventas',
    element: <Ventas />,
  },
  {
    path: 'proveedores',
    element: <Proveedores />,
  },
  {
    path: 'clientes',
    element: <Clientes />,
  },
  {
    path: 'metodos-pago',
    element: <MetodosPago />,
  },
  {
    path: 'marca-productos',
    element: <MarcaProductos />,
  },
  {
    path: 'referencia-productos',
    element: <ReferenciaProductos />,
  },
  {
    path: 'tipo-clientes',
    element: <TipoClientes />,
  },
  {
    path: 'estados-venta',
    element: <EstadosVenta />,
  },
  {
    path: 'metodo-envio-venta',
    element: <MetodoEnvioVenta />,
  },
  {
    path: 'informes',
    element: <Informes />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
