// IMPORTACIONES BÁSICAS
import '../App.css';
import Home from '../componentes/Home';
import Login from '../componentes/Login';
import { useState, useEffect } from 'react';

// IMPORTAR SUPABASE
import { supabase } from '../../supabase';

// MODULOS ENRUTAMIENTO
import { Outlet } from 'react-router-dom';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Verificar el estado de autenticación con Supabase
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUsuario(session.user); // Usuario correctamente autenticado
        console.log(session.user);
      } else {
        setUsuario(null); // Usuario no autenticado
      }
    };

    verificarSesion();

    // Escuchar los cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    // Cleanup listener al desmontar el componente
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      {usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default App;

