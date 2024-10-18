import React from 'react';
import { Link } from 'react-router-dom';
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa
import SignUpImg from "../../public/signup.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-auto">

            {/* Lado izquierdo con el formulario de registro */}
            <div className="dark:bg-[#242424] bg-white lg:col-span-1 p-6 flex flex-col justify-center items-center lg:h-full">

                {/* Logo de la empresa */}
                <img
                    src={Proofisillas2} // Logo de la empresa
                    alt="Logo de Proofisillas"
                    className="h-auto w-auto max-w-[500px] object-contain mb-8"
                />

                <h3 className="dark:text-white text-[#292929] text-3xl font-extrabold mb-8">Crear cuenta</h3>

                <div className="space-y-4 w-full">
                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faAt} className="text-slate-400 ml-4" />
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Correo electrónico"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faLock} className="text-slate-400 ml-4" />
                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Contraseña"
                            />
                        </div>
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
                    <span className="text-slate-400 font-normal">Tienes cuenta? </span>
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 font-semibold">Inicia sesión acá</Link>
                </div>
            </div>

            {/* Lado derecho vacío, oculto en pantallas pequeñas */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-yellow-500 to-orange-500 p-6 h-screen">
                <img
                    src={SignUpImg} // Logo de la empresa
                    alt="Logo de Proofisillas"
                    className="h-auto w-auto m-auto object-contain mb-8"
                />
            </div>

        </div>

    )
}

export default SignUp;