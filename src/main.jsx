import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App.jsx';
import Login from './componentes/Login.jsx';
import ErrorPage from './paginaError.jsx';
import Configuracion from './componentes/Configuracion.jsx';
import Productos from './componentes/productos/Productos.jsx';
import Ventas2 from './componentes//ventas/Ventas2.jsx';
import Proveedores from './componentes/proveedores/Proveedores.jsx';
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
    element: <Productos2 />,
  },
  {
    path: 'ventas',
    element: <Ventas2 />,
  },
  {
    path: 'proveedores',
    element: <Proveedores2 />,
  },
  {
    path: 'clientes',
    element: <Clientes2 />,
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
