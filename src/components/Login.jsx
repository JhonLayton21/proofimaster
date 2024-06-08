import React from 'react'
import Proofisillas2 from '../../public/proofisillas2.svg';
import '../App.css'

const Login = () => {
  return (
    <div class="grid grid-cols-3 gap-0 h-full">

      {/* CUADRO IZQUIERDA ELEMENTOS VISUALES PROOFISILLAS */}
      <div className="bg-transparent p-3">
        <h1 className="text-left">Bienvenido a PROOFIMASTER</h1>
        <h2 className="text-right">Gestiona tu negocio fácilmente y enfocate en la productividad</h2>
        <img src={Proofisillas2} alt="" srcset="" className="absolute bottom-8 h-[480px] w-[480px]" />
      </div>

      {/* CUADRO DERECHA FORMULARIO INICIO SESION */}
      <div className="bg-[#242424] col-span-2 p-3 rounded-bl-3xl rounded-tl-3xl grid place-items-center">

        <p className="text-white absolute top-2 right-2 p-2">Eres cliente de Proofisillas? Accede a <a href="https://proofisillas.com/" className="text-[#E06D00] font-bold">https://proofisillas.com/</a> </p>

        <form action="" className="">
          <h1 className="py-5 text-7xl font-bold">Inicia Sesión</h1>

          <div className="flex items-center mb-4 py-4">
            <label for="email" className="text-white mr-2">Usuario</label>
            <input type="email" name="email" id="email" className="border border-gray-700 rounded px-3 py-2 w-full" />
          </div>

          <div className="flex items-center mb-4 py-4">
            <label for="password" className="text-white mr-2">Contraseña</label>
            <input type="password" name="password" id="password" className="border border-gray-700 rounded px-3 py-2 w-full" />
          </div>

          <div className="flex items-center py-4 justify-center">
            <input type="checkbox" name="checkbox" id="checkbox" />
            <label for="checkbox" className="text-white ml-2">Recordar contraseña</label>
          </div>

          <button className="text-white font-bold py-2 px-1 rounded-xl w-96 text-2xl">
            Iniciar sesión
          </button>
        </form>

        <p className="text-white absolute bottom-6">Olvidaste tu contraseña? <a href="https://proofisillas.com/" className="text-[#E06D00] font-bold">Recupera tu cuenta aquí</a> </p>
      </div>

    </div>
  )
}

export default Login
