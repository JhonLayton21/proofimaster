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
  const [isLoading, setIsLoading] = useState(true);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });

  // Verificar el estado de carga y los datos del usuario al montar el componente
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const redirectTo = process.env.NODE_ENV === "development"
    ? "http://localhost:5173/"
    : "https://proofimaster.vercel.app/";

  useEffect(() => {
    if (!loading) {
      if (usuario) {
        if (rol === "administrador") {
          navigate("/configuracion");
        } else if (rol === "usuario básico") {
          navigate("/");
        } else {
          alert("No posees permisos para acceder, contacta al administrador.");
          navigate("/login");
        }
      }
    }
  }, [usuario, rol, loading, navigate]);

  const handleLogin = async () => {
    // Validación en el cliente para verificar que todos los campos estén llenos
    if (!email || !password) {
      setAlerta({
        mostrar: true,
        mensaje: 'Por favor, completa todos los campos.',
        tipo: 'error'
      });
      return; // Detener la ejecución si la validación falla
    }

    // Validación para evitar espacios en blanco en el email o la contraseña
    if (/\s/.test(email) || /\s/.test(password)) {
      setAlerta({
        mostrar: true,
        mensaje: 'El correo y la contraseña no deben contener espacios en blanco.',
        tipo: 'error'
      });
      return;
    }

    // Validación de formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlerta({
        mostrar: true,
        mensaje: 'Por favor, introduce un correo electrónico válido.',
        tipo: 'error'
      });
      return; // Detener la ejecución si la validación falla
    }

    // Validación de longitud de la contraseña
    if (password.length < 6) {
      setAlerta({
        mostrar: true,
        mensaje: 'La contraseña debe tener al menos 6 caracteres.',
        tipo: 'error'
      });
      return; // Detener la ejecución si la validación falla
    }

    try {
      console.log('Intentando iniciar sesión con:', { email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Verifica si hay un error de la API
      if (error) {
        let mensajeError = 'Error desconocido durante el inicio de sesión.';
        if (error.message.includes('Invalid login credentials')) {
          mensajeError = 'Credenciales de inicio de sesión inválidas.';
        } else if (error.message.includes('User not confirmed')) {
          mensajeError = 'Usuario no confirmado. Verifica tu correo electrónico.';
        } else if (error.message.includes('Email not verified')) {
          mensajeError = 'Correo electrónico no verificado. Por favor, verifica tu cuenta.';
        } else if (error.message.includes('Invalid email or password')) {
          mensajeError = 'Correo electrónico o contraseña incorrectos.';
        }

        console.error('Error de Supabase durante el inicio de sesión:', error);
        setAlerta({
          mostrar: true,
          mensaje: mensajeError,
          tipo: 'error'
        });
      } else if (data) {
        console.log('Inicio de sesión con éxito:', data);
        setAlerta({
          mostrar: true,
          mensaje: 'Inicio de sesión exitoso.',
          tipo: 'exito'
        });
        // Redirigir al usuario o realizar alguna acción adicional
        navigate('/'); // Reemplaza con la ruta deseada
      } else {
        console.warn('No se ha recibido ni error ni datos. Posible fallo desconocido.');
        setAlerta({
          mostrar: true,
          mensaje: 'No se pudo completar la solicitud. Inténtalo más tarde.',
          tipo: 'error'
        });
      }
    } catch (err) {
      console.error('Excepción capturada durante el inicio de sesión:', err);
      setAlerta({
        mostrar: true,
        mensaje: 'Error inesperado iniciando sesión.',
        tipo: 'error'
      });
    } finally {
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlerta({ mostrar: false, mensaje: '', tipo: '' });
      }, 5000);
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


  // Mostrar spinner mientras `loading` es true
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
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
        <div className="flex justify-end items-center w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <span className="text-slate-400 font-normal">¿Ya nos conoces? </span>
              <a
                href="https://proofisillas.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-500 font-semibold cursor-pointer"
              >
                Haz clic aquí
              </a>
            </div>
          </div>
        </div>

        {/* Logo de la empresa */}
        <img
          src={Proofisillas2} // Logo de la empresa
          alt="Logo de Proofisillas"
          className="h-auto w-auto max-w-[500px] object-contain mb-8"
        />

        <h3 className="dark:text-white text-[#292929] text-3xl font-extrabold mb-8">Iniciar sesión</h3>
        {/* Alerta */}
        {alerta.mostrar && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${alerta.tipo === 'error' ? 'text-red-600 bg-red-100 border-2 border-red-600' : 'text-green-600 bg-green-100 border-2 border-green-600'}`} role="alert">
            <span className="font-medium">{alerta.tipo === 'error' ? 'Error' : 'Éxito'}:</span> {alerta.mensaje}
          </div>
        )}
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
        <div className="space-x-6 flex justify-center p-1 mb-2 rounded-3xl bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] bg-clip-border cursor-pointer" onClick={handleGoogleLogin}>
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
      </div>
    </div>

  );
};

export default Login;
