// IMPORTACIONES BÁSICAS
import '../App.css';
import Home from '../componentes/Home';
import Login from '../componentes/Login';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../UseAuth';

// IMPORTAR SUPABASE
import { supabase } from '../../supabase';

// MODULOS ENRUTAMIENTO
import { Outlet } from 'react-router-dom';

function App() {
  const { usuario } = useAuth();

  return (
    <>
      {usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}


export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}


