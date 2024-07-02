import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import appFirebase from '../credenciales';

const auth = getAuth(appFirebase);

const Home = ({ correoUsuario }) => {

    return (
        <div className="grid grid-cols-4 gap-0 h-full">
            {/* MENU LATERAL */}
            <div class="flex items-center justify-center p-8 hidden md:block min-w-[320px] max-w-full">
                <div class="flex flex-col space-y-2"> <h1 class="text-left md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl pb-2 font-bold whitespace-nowrap overflow-hidden">PROOFIMASTER</h1>
                    <h2 class="text-left text-[#242424] font-semibold">Proofisillas LTDA.</h2>
                    <h3 class="text-left text-[#242424] font-semibold">NIT: 1234567890</h3>
                    <ul class="list-none mt-4"> <li class="text-left hover:text-orange-500 font-semibold text-2rem">
                        <Link to="/productos">Productos</Link>
                    </li>
                        <li class="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/ventas">Ventas</Link>
                        </li>
                        <li class="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/proveedores">Proveedores</Link>
                        </li>
                        <li class="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/clientes">Clientes</Link>
                        </li>
                        <li class="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/informes">Informes</Link>
                        </li>
                    </ul>
                </div>
            </div>


            {/* MENU PRINCIPAL */}
            <div className="bg-[#242424] col-span-4 md:col-span-3 p-8 min-w-[320px] w-full">
                <div className="grid grid-cols-2">
                    <div className="col-span-1">
                        <p className="text-xl font-semibold text-right">Documentación</p>
                        <p className="text-xl font-medium text-[#757575] text-right">Entiende la plataforma</p>
                    </div>
                    <div className="col-span-1">
                        <p className="text-xl font-semibold text-right">{correoUsuario} </p>
                        <p className="text-xl font-medium text-[#757575] text-right">Administrador</p>

                        <Link to="/configuracion">Configuracion</Link>
                        <button className="btn btn-primary" onClick={() => signOut(auth)}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
                <h1 className="text-left text-3xl pt-8 font-bold whitespace-nowrap overflow-hidden">MENÚ PRINCIPAL</h1>
                <p className="text-left text-[#757575] ">Accede rápidamente al contenido de Proofisillas</p>
                <div className="py-12 grid grid-cols-4 gap-4">
                    <div className="col-span-1 bg-white w-[300px] h-[300px] rounded">
                        <h1 className="text-[#242424] p-2 text-left text-xl font-bold whitespace-nowrap overflow-hidden">PRODUCTOS PRINCIPALES</h1>
                    </div>
                    <div className="col-span-1 bg-white w-[300px] h-[300px] rounded">
                        <h1 className="text-[#242424] p-2 text-left text-xl font-bold whitespace-nowrap overflow-hidden">TOTAL DE VENTAS</h1>
                    </div>
                    <div className="col-span-1 bg-[#FFCD29] w-[150px] h-[300px] rounded">
                        <h1 className="text-[#242424] p-2 text-left text-xl font-bold break-words">ALERTAS DE STOCK</h1>
                    </div>
                    <div className="col-span-1 bg-white w-[300px] h-[300px] rounded"></div>
                </div>
                <div className="py-4 grid grid-cols-4">
                    <div className="col-span-2 bg-[#FCD19C] w-[300px] h-[300px] rounded"></div>
                    <div className="col-span-2 bg-white w-[300px] h-[300px] rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;
