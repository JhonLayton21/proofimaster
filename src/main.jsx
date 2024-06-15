import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './rutas/App.jsx';
import Login from './componentes/Login.jsx';
import ErrorPage from './paginaError.jsx';
import Configuracion from './componentes/configuracion.jsx';
import Root from './rutas/Root.jsx';
import './index.css';

//IMPORTACIONES PARA ENRUTAMIENTO
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "configuracion",
    element: <Configuracion />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
