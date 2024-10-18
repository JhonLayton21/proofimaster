import React from 'react';
import { Link } from 'react-router-dom';
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa

const SignUp = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">

            {/* Lado izquierdo con el formulario de registro */}
            <div className="dark:bg-[#242424] bg-[#242424] lg:col-span-1 p-6 flex flex-col justify-center items-center lg:h-full">

                {/* Logo de la empresa */}
                <img
                    src={Proofisillas2} // Logo de la empresa
                    alt="Logo de Proofisillas"
                    className="h-auto w-auto lg:h-[120px] lg:w-[120px] object-contain mb-8"
                />

                <h3 className="text-white text-3xl font-extrabold mb-8">Crear cuenta</h3>

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
                </div>

                <div className="!mt-8 w-full">
                    <button
                        type="button"
                        className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-orange-600 hover:bg-orange-500 focus:outline-none"
                    >
                        <span className="text-xl font-bold">Registrarse</span>
                    </button>
                </div>

                <div className="text-sm pt-3">
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 font-semibold">
                        <span className="text-slate-400">Tienes cuenta? </span>Inicia sesión acá
                    </Link>
                </div>
            </div>

            {/* Lado derecho vacío, oculto en pantallas pequeñas */}
            <div className="hidden md:block bg-gradient-to-b from-yellow-500 to-orange-500 p-6">
            </div>

        </div>

    )
}

export default SignUp;