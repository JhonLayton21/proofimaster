import React from 'react';
import Proofisillas2 from '../../public/proofisillas2.svg';
//CONFIGURACION FIREBASE
import appFirebase from '../credenciales';

//FUNCIONES FIREBASE A USAR 
import { getAuth, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

//INSTANCIA INICIAL AUTENTICACION
const auth = getAuth(appFirebase)

const Home = ({ correoUsuario }) => {
    return (
        <>
            <div className="grid grid-cols-4 gap-0 h-full">

                {/* MENU LATERAL */}
                <div className="p-8 hidden md:block min-w-[320px] max-w-full">
                    <h1 className='text-left md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl pb-2 font-bold whitespace-nowrap overflow-hidden'>PROOFIMASTER</h1>
                    <h2 className="text-left text-[#242424] font-semibold">Proofisillas LTDA.</h2>
                    <h3 className="text-left text-[#242424] font-semibold">NIT: 1234567890</h3>
                </div>

                {/* MENU PRINCIPAL */}
                <div className="bg-[#242424] col-span-4 md:col-span-3 p-8 min-w-[320px] w-full">
                    Bienvenido usuario {correoUsuario} <br />
                    <Link to="/configuracion">Configuracion</Link>
                    <button className="btn btn-primary" onClick={() => signOut(auth)}>
                        Cerrar sesión
                    </button>
                    <h1 className="text-left text-3xl font-bold whitespace-nowrap overflow-hidden">MENÚ PRINCIPAL</h1>
                    <p className="text-left text-[#757575]">Accede rápidamente al contenido de Proofisillas</p>
                    <div className="py-4 grid grid-cols-4 gap-4">
                        <div className="col-span-1 bg-white w-[300px] h-[300px] rounded">
                            <h1 className="text-[#242424] p-2 text-left text-xl font-bold whitespace-nowrap overflow-hidden">PRODUCTOS PRINCIPALES</h1>
                        </div>
                        <div className="col-span-1 bg-white w-[300px] h-[300px] rounded">
                            <h1 className="text-[#242424] p-2 text-left text-xl font-bold whitespace-nowrap overflow-hidden">TOTAL DE VENTAS</h1>
                        </div>
                        <div className="col-span-1 bg-[#FFCD29] w-[150px] h-[300px] rounded">
                            <h1 className="text-[#242424] p-2 text-left text-xl font-bold break-words">ALERTAS DE STOCK</h1>
                        </div>
                        <div className="col-span-1 bg-white w-[300px] h-[300px] rounded">

                        </div>
                    </div>
                    <div className="py-4 grid grid-cols-4">
                        <div className="col-span-2 bg-[#FCD19C] w-[300px] h-[300px] rounded">

                        </div>
                        <div className="col-span-2 bg-white w-[300px] h-[300px] rounded">

                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Home;