import React, { useState, useEffect } from "react";
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa
import "../App.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../UseAuth";
import { supabase } from "../../supabase";
import { Link } from 'react-router-dom';

const Login = () => {
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
          navigate("/login");
        }
      }
    }
  }, [usuario, rol, loading, navigate]);

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

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
      {/* Lado izquierdo vacío, oculto en pantallas pequeñas */}
      <div className="hidden md:block bg-gradient-to-b from-yellow-500 to-orange-500 p-6"></div>

      {/* Lado derecho con el formulario de inicio de sesión */}
      <div className="dark:bg-[#242424] bg-[#242424] lg:col-span-1 p-6 flex flex-col justify-center items-center lg:h-full">

        {/* Logo de la empresa */}
        <img
          src={Proofisillas2} // Logo de la empresa
          alt="Logo de Proofisillas"
          className="h-auto w-auto lg:h-[120px] lg:w-[120px] object-contain mb-8"
        />

        <h3 className="text-white text-3xl font-extrabold mb-8">Iniciar sesión</h3>

        {/* Formulario inicio sesión */}
        <div className="space-y-4 w-full">
          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-[#333] text-white w-full text-sm px-4 py-2.5 rounded-md border-solid border-1 focus:outline-none focus:ring focus:ring-orange-500 border-slate-500"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-[#333] text-white w-full text-sm px-4 py-2.5 rounded-md border-solid border-1 focus:outline-none focus:ring focus:ring-orange-500 border-slate-500"
              placeholder="Contraseña"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <a href="javascript:void(0);" className="text-orange-600 hover:text-orange-500 font-semibold">
                <span className="text-slate-400">Olvidaste tu contraseña? </span>Recuperala aquí
              </a>
            </div>
          </div>
        </div>

        {/* Botón inicio sesión */}
        <div className="!mt-8 w-full">
          <button
            type="button"
            className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-orange-600 hover:bg-orange-500 focus:outline-none"
          >
            <span className="text-xl font-bold">Iniciar sesión</span>
          </button>
        </div>

        {/* link crear cuenta */}
        <div className="text-sm pt-3">
          <Link to="/signup" className="text-orange-600 hover:text-orange-500 font-semibold">
            <span className="text-slate-400">No tienes cuenta? </span>Registrate aquí
          </Link>
        </div>

        {/* Separador "OR" */}
        <div className="flex items-center justify-center w-full my-4">
          <hr className="w-full border-slate-400" />
          <span className="px-2 text-slate-400 text-sm">o</span>
          <hr className="w-full border-gray-400" />
        </div>

        {/* Inicio sesión Google */}
        <div className="space-x-6 flex justify-center p-1 rounded-3xl bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] bg-clip-border" onClick={handleGoogleLogin}>
          <div className="p-2 bg-white rounded-3xl">
            <button
              className="border-none outline-none bg-transparent p-0 flex items-center space-x-2"
            >
              <img
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span className="text-slate-900 font-light">Iniciar sesión con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
