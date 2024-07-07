import React from 'react';
import { Link } from 'react-router-dom';

const MenuLateral = () => {

    return (
        <>
            {/* MENU LATERAL */}
            <div className="flex items-center justify-center p-8 hidden md:block min-w-[320px] max-w-full">
                <div className="flex flex-col space-y-2"> 
                    <h1 className="text-left md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl pb-2 font-bold whitespace-nowrap overflow-hidden">  <Link to="/">PROOFIMASTER</Link> </h1>
                    <h2 className="text-left text-[#242424] font-semibold">Proofisillas LTDA.</h2>
                    <h3 className="text-left text-[#242424] font-semibold">NIT: 1234567890</h3>
                    <ul className="list-none mt-4"> <li className="text-left hover:text-orange-500 font-semibold text-2rem">
                        <Link to="/productos">Productos</Link>
                    </li>
                        <li className="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/ventas">Ventas</Link>
                        </li>
                        <li className="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/proveedores">Proveedores</Link>
                        </li>
                        <li className="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/clientes">Clientes</Link>
                        </li>
                        <li className="text-left hover:text-orange-500 font-semibold text-2rem">
                            <Link to="/informes">Informes</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MenuLateral;
