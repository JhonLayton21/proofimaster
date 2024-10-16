import React, { useState, useEffect } from "react";
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa
import "../App.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../UseAuth"; 
import { supabase } from "../../supabase";

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
      {/* Lado izquierdo vacío */}
      <div className="bg-gradient-to-b from-yellow-500 to-orange-500 p-6 lg:rounded-bl-3xl lg:rounded-tl-3xl"></div>

      {/* Lado derecho con el formulario de inicio de sesión */}
      <div className="dark:bg-[#242424] bg-[#242424] lg:col-span-1 p-6 flex flex-col justify-center items-center lg:rounded-bl-3xl lg:rounded-tl-3xl lg:h-full">
        {/* Mensaje de bienvenida centrado en la parte superior */}
        <h2 className="text-white text-3xl font-bold mb-8 absolute top-8 text-center w-full">
          ¡Bienvenido a Proofisillas!
        </h2>

        {/* Logo de la empresa */}
        <img
          src={Proofisillas2} // Logo de la empresa
          alt="Logo de Proofisillas"
          className="h-auto w-auto lg:h-[120px] lg:w-[120px] object-contain mb-8"
        />

        <h3 className="text-white text-3xl font-extrabold mb-8">Iniciar sesión</h3>

        <div className="space-y-4 w-full">
          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-[#333] text-white w-full text-sm px-4 py-2.5 rounded-md outline-blue-600 focus:bg-transparent"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-[#333] text-white w-full text-sm px-4 py-2.5 rounded-md outline-blue-600 focus:bg-transparent"
              placeholder="Contraseña"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-white">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <a href="javascript:void(0);" className="text-blue-600 hover:text-blue-500 font-semibold">
                Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        <div className="!mt-8 w-full">
          <button
            type="button"
            className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-[#4CAF50] hover:bg-green-600 focus:outline-none"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="space-x-6 flex justify-center mt-8">
          <button 
            onClick={handleGoogleLogin} 
            className="border-none outline-none bg-transparent p-0"
          >
            {/* Logo de Google - solo la "G" */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
              alt="Google logo"
              className="w-10 h-10"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
