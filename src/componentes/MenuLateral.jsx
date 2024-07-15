import React from 'react';
import { Link } from 'react-router-dom';

const MenuLateral = () => {

    return (
        <>
            {/* MENU LATERAL */}
            <div className="flex items-center justify-center p-8 hidden md:block min-w-[320px] max-w-full">
                <div className="flex flex-col space-y-2">
                    <div className="border-b border-solid">
                        <h1 className="text-left text-slate-100 md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl pb-6 font-bold whitespace-nowrap overflow-hidden">  <Link to="/">PROOFIMASTER</Link> </h1>
                        <h2 className="text-left text-[#242424] font-semibold text-xl pb-2">Proofisillas LTDA.</h2>
                        <h3 className="text-left text-[#242424] font-semibold text-xl pb-6">NIT: 1234567890</h3>
                    </div>
                    <div className="flex justify-center items-center">
                        <ul className="list-none">
                            <li className="text-center text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <Link to="/productos">Productos</Link>
                            </li>
                            <li className="text-center text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <Link to="/ventas">Ventas</Link>
                            </li>
                            <li className="text-center text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <Link to="/proveedores">Proveedores</Link>
                            </li>
                            <li className="text-center text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <Link to="/clientes">Clientes</Link>
                            </li>
                            <li className="text-center text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <Link to="/informes">Informes</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="border-t border-solid ">

                    </div>


                </div>
            </div>
        </>
    );
};

export default MenuLateral;
