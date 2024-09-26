import React, { useState, useEffect } from 'react';
import Proofisillas2 from '../../public/proofisillas2.svg';
import '../App.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../UseAuth'; 
import { supabase } from '../../supabase';

const Login = () => {
  const [error, setError] = useState(null);
  const { usuario, rol, loading } = useAuth(); // Desestructurar usuario y rol del contexto
  const navigate = useNavigate();

  const redirectTo = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173/'
    : 'https://proofimaster.vercel.app/';

  useEffect(() => {
    // Redirigir según el rol una vez que se haya verificado
    if (!loading) {
      if (usuario) {
        if (rol === 'admin') {
          navigate('/configuracion');
        } else if (rol === 'user') {
          navigate('/');
        } else if (rol === 'sin_permiso') {
          navigate('/solicitar-permiso');
        } else {
          navigate('/login');
        }
      }
    }
  }, [usuario, rol, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      });

      if (error) throw error;
      
      // No es necesario navegar manualmente aquí
    } catch (error) {
      setError(error.message);
    }
  };

  // Si está cargando, no renderizar nada o mostrar un loader
  if (loading) {
    return <div>Cargando...</div>; // O algún spinner
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
      <div className="bg-gradient-to-b from-yellow-500 to-orange-500 p-6 flex flex-col items-center justify-center lg:rounded-bl-3xl lg:rounded-tl-3xl relative overflow-hidden">
        <h1 className="text-center text-slate-50 font-semibold text-3xl lg:text-left">Bienvenido a PROOFIMASTER</h1>
        <p className="text-center text-slate-50 font-medium italic my-3 lg:text-left">Gestiona tu negocio fácilmente y enfócate en la productividad</p>
        <img src={Proofisillas2} alt="" className="h-32 w-32 lg:h-auto lg:w-auto lg:absolute lg:relative bottom-8 right-8 lg:bottom-0 lg:right-0 lg:h-[480px] lg:w-[480px] object-contain lg:object-scale-down mx-auto lg:mx-0" />
      </div>

      <div className="dark:bg-[#242424] bg-[#D3D3D3] lg:col-span-1 p-6 flex flex-col justify-center items-center lg:rounded-bl-3xl lg:rounded-tl-3xl lg:h-full">
        <button onClick={handleGoogleLogin} className="bg-[#DB4437] text-white font-bold py-2 px-4 rounded-xl w-full text-2xl btnLogin mt-4">
          Iniciar sesión con Google
        </button>

        <div className="flex flex-col lg:flex-row justify-between w-full mt-4 text-xs dark:text-slate-50 text-[#757575] lg:mt-auto">
          <p className="mb-2 lg:mb-0">Eres cliente de Proofisillas? <a href="https://proofisillas.com/" className="text-[#E06D00] font-bold">Accede aquí</a></p>
          <p>Olvidaste tu contraseña? <a href="https://proofisillas.com/" className="text-[#E06D00] font-bold">Recupera tu cuenta aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;












