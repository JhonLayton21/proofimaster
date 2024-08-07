import React, { useState, useEffect } from 'react';
import Proofisillas2 from '../../public/proofisillas2.svg';
import '../App.css';

// CONFIGURACION FIREBASE
import appFirebase, { auth, googleProvider } from '../credenciales';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// MODULOS FIREBASE
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const db = getFirestore(appFirebase);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User logged in with Google:', result.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
      <div className="bg-gradient-to-b from-yellow-500 to-orange-500 p-6 flex flex-col items-center justify-center lg:rounded-bl-3xl lg:rounded-tl-3xl relative overflow-hidden">
        <h1 className="text-center text-slate-50 font-semibold text-3xl lg:text-left">Bienvenido a PROOFIMASTER</h1>
        <p className="text-center text-slate-50 font-medium italic my-3 lg:text-left">Gestiona tu negocio fácilmente y enfócate en la productividad</p>
        <img src={Proofisillas2} alt="" className="h-32 w-32 lg:h-auto lg:w-auto lg:absolute lg:relative bottom-8 right-8 lg:bottom-0 lg:right-0 lg:h-[480px] lg:w-[480px] object-contain lg:object-scale-down mx-auto lg:mx-0" />
      </div>

      <div className="dark:bg-[#242424] bg-[#D3D3D3] lg:col-span-1 p-6 flex flex-col justify-center items-center lg:rounded-bl-3xl lg:rounded-tl-3xl lg:h-full">
        <form onSubmit={handleLogin} className="w-full max-w-sm my-auto">
          <h1 className="text-4xl font-bold dark:text-slate-50 text-[#242424] mb-6 text-center lg:text-center">Inicia Sesión</h1>
          <div className="mb-4">
            <label htmlFor="email" className="dark:text-slate-50 text-[#242424] font-medium">Usuario</label>
            <input type="email" id="email" className="border border-[#E06D00] rounded px-3 py-2 w-full mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="dark:text-slate-50 text-[#242424] font-medium">Contraseña</label>
            <input type="password" id="password" className="border border-[#E06D00] rounded px-3 py-2 w-full mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button className="bg-[#E06D00] text-white font-bold py-2 px-4 rounded-xl w-full text-2xl btnLogin">
            Iniciar sesión
          </button>
        </form>
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










