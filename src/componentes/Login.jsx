import React, { useState, useEffect } from "react";
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa
import LoginImg from "../../public/login.svg";
import "../App.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../UseAuth";
import { supabase } from "../../supabase";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { usuario, rol, loading } = useAuth();
  const navigate = useNavigate();

  const redirectTo = process.env.NODE_ENV === "development"
    ? "http://localhost:5173/"
    : "https://proofimaster.vercel.app/";

  useEffect(() => {
    if (!loading) {
      if (usuario) {
        if (rol === "admin") {
          navigate("/configuracion");
        } else if (rol === "user") {
          navigate("/");
        } else if (rol === "sin_permiso") {
          navigate("/solicitar-permiso");
        } else {
          alert("No posees permisos para acceder, contacta al administrador.");
          navigate("/login");
        }
      }
    }
  }, [usuario, rol, loading, navigate]);

  const handleLogin = async () => {
    try {
      console.log('Intentando iniciar sesión con:', { email, password });
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      // Verifica si hay un error de la API
      if (error) {
        console.error('Error de Supabase durante el inicio de sesión:', error);
        setError(error.message); // Muestra el mensaje de error en el UI
      } else if (data) {
        console.log('Inicio de sesión con éxito:', data);
        // Aquí puedes redirigir al usuario o realizar alguna acción adicional
      } else {
        console.warn('No se ha recibido ni error ni datos. Posible fallo desconocido.');
        setError('No se pudo completar la solicitud. Inténtalo más tarde.');
      }
    } catch (err) {
      console.error('Excepción capturada durante el inicio de sesión:', err);
      setError('Error inesperado iniciando sesión');
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Por favor ingresa un correo electrónico.');
      return;
    }
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo + 'restablecer-contraseña', // Redirige a una página donde el usuario podrá actualizar su contraseña
      });
      
      if (error) {
        setError('Error al enviar el correo de recuperación: ' + error.message);
      } else {
        setError('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
      }
    } catch (err) {
      setError('Error inesperado al intentar recuperar la contraseña.');
    }
  };
  

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-auto">
      {/* Lado izquierdo vacío, oculto en pantallas pequeñas */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-yellow-500 to-orange-500 p-6 h-screen">
        <img
          src={LoginImg} // Logo de la empresa
          alt="Logo de Proofisillas"
          className="h-auto w-auto m-auto object-contain mb-8"
        />
      </div>

      {/* Lado derecho con el formulario de inicio de sesión */}
      <div className="dark:bg-[#242424] bg-white lg:col-span-1 p-6 flex flex-col justify-center items-center lg:h-full">

        {/* Logo de la empresa */}
        <img
          src={Proofisillas2} // Logo de la empresa
          alt="Logo de Proofisillas"
          className="h-auto w-auto max-w-[500px] object-contain mb-8"
        />

        <h3 className="dark:text-white text-[#292929] text-3xl font-extrabold mb-8">Iniciar sesión</h3>

        {/* Formulario inicio sesión */}
        <div className="space-y-4 w-full">
          <div className="bg-slate-100 dark:bg-[#292929]">
            <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
              <FontAwesomeIcon icon={faAt} className="text-slate-400 ml-4" />
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                placeholder="Correo electrónico"
              />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-[#292929]">
            <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
              <FontAwesomeIcon icon={faLock} className="text-slate-400 ml-4" />
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <span className="text-slate-400 font-normal">Olvidaste tu contraseña? </span>
              <a onClick={handlePasswordReset} className="text-orange-600 hover:text-orange-500 font-semibold cursor-pointer">Recuperala aquí</a>
            </div>
          </div>
        </div>

        {/* Botón inicio sesión */}
        <div className="!mt-8 w-full">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-orange-600 hover:bg-orange-500 focus:outline-none"
          >
            <span className="text-xl font-bold">Iniciar sesión</span>
          </button>
        </div>

        {/* link crear cuenta */}
        <div className="text-sm pt-3">
          <span className="text-slate-400 font-normal">No tienes cuenta? </span>
          <Link to="/signup" className="text-orange-600 hover:text-orange-500 font-semibold">Registrate aquí</Link>
        </div>

        {/* Separador "OR" */}
        <div className="flex items-center justify-center w-full my-4">
          <hr className="w-full border-slate-400" />
          <span className="px-2 text-slate-400 text-sm">o</span>
          <hr className="w-full border-gray-400" />
        </div>

        {/* Inicio sesión Google */}
        <div className="space-x-6 flex justify-center p-1 rounded-3xl bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] bg-clip-border cursor-pointer" onClick={handleGoogleLogin}>
          <div className="p-2 bg-white rounded-3xl">
            <button
              className="border-none outline-none bg-transparent p-0 flex items-center space-x-2"
            >
              <img
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span className="text-[#292929] font-light">Iniciar sesión con Google</span>
            </button>
          </div>
        </div>
        {error && <p>{error}</p>}
      </div>
    </div>

  );
};

export default Login;
