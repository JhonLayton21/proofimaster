import React from 'react'
import Proofisillas2 from '../../public/proofisillas2.svg';

const Login = () => {
  return (
    <div class="grid grid-cols-2 gap-0">
      <div className="bg-transparent p-3">
        <h1>Bienvenido a PROOFIMASTER</h1>
        <h2>Gestiona tu negocio fácilmente y enfocate en la productividad</h2>
        <img src={Proofisillas2} alt="" srcset="" />
      </div>

      <div className="bg-[#242424] p-3 rounded-bl-3xl rounded-tl-3xl">
        <form action="">
          <h1 className="p-2">Inicia Sesión</h1>

          <div className="flex items-center mb-4">
            <label for="email" className="text-white mr-2">Usuario</label>
            <input type="email" name="email" id="email" className="border border-gray-700 rounded px-3 py-2 w-full" />
          </div>

          <div className="flex items-center mb-4">
            <label for="password" className="text-white mr-2">Contraseña</label>
            <input type="password" name="password" id="password" className="border border-gray-700 rounded px-3 py-2 w-full" />
          </div>

          <div className="flex items-center">
            <input type="checkbox" name="checkbox" id="checkbox" />
            <label for="checkbox" className="text-white ml-2">Recordar contraseña</label>
          </div>

          <button className="text-white font-bold py-2 px-4 rounded-xl">
            Iniciar sesión
          </button>
        </form>
      </div>

    </div>
  )
}

export default Login
