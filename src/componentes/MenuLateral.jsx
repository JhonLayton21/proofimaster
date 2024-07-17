import React from 'react';
import { Link } from 'react-router-dom';
import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faCar, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(appFirebase);

const MenuLateral = () => {
    return (
        <>
            {/* MENU LATERAL */}
            <div className="flex items-center justify-center p-8 hidden md:block min-w-[320px] max-w-full h-full">
                <div className="flex flex-col space-y-2 h-full">
                    <div className="border-b border-solid">
                        <h1 className="text-left text-slate-100 md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl pb-6 font-bold whitespace-nowrap overflow-hidden">
                            <Link to="/">PROOFIMASTER</Link>
                        </h1>
                        <h2 className="text-left text-[#242424] font-semibold text-xl pb-2">Proofisillas LTDA.</h2>
                        <h3 className="text-left text-[#242424] font-semibold text-xl pb-6">NIT: 1234567890</h3>
                    </div>
                    <div className="flex justify-center items-center flex-grow">
                        <ul className="list-none">
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faHouse} className="fa-1x mx-2" />
                                <Link to="/">Dashboard</Link>
                            </li>
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faCartShopping} className="fa-1x mx-2" />
                                <Link to="/productos">Productos</Link>
                            </li>
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-1x mx-2" />
                                <Link to="/ventas">Ventas</Link>
                            </li>
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faTruckFast} className="fa-1x mx-2" />
                                <Link to="/proveedores">Proveedores</Link>
                            </li>
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faAddressBook} className="fa-1x mx-2" />
                                <Link to="/clientes">Clientes</Link>
                            </li>
                            <li className="text-left text-slate-100 hover:text-orange-800 font-semibold text-2xl m-10">
                                <FontAwesomeIcon icon={faChartSimple} className="fa-1x mx-2" />
                                <Link to="/informes">Informes</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="border-t border-solid mt-auto">
                        <button className="btn btn-primary my-4 font-semibold" onClick={() => signOut(auth)}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="fa-1x mx-2" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuLateral;

