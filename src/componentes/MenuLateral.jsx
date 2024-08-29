import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faBars, faCar, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(appFirebase);

const MenuLateral = () => {
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            {/* MENU LATERAL */}
            <div className="flex p-4 hidden md:block min-w-[240px] max-w-full h-full">
                <div className="flex flex-col justify-start space-y-2 h-full">

                    {/* HEADER */}
                    <div className="border-b border-solid">
                        <div className="flex items-center justify-between pb-6">
                            <h1 className="text-left text-slate-100 hover:text-orange-800 md:text-xl lg:text-2xl font-bold whitespace-nowrap overflow-hidden">
                                <Link to="/">PROOFIMASTER</Link>
                            </h1>
                            <FontAwesomeIcon icon={faBars} className="fa-2x hover:text-orange-800 text-slate-100 cursor-pointer" />
                        </div>
                        <h2 className="text-left text-[#242424] font-semibold text-base pb-2">Proofisillas LTDA.</h2>
                        <h3 className="text-left text-[#242424] font-semibold text-base pb-6">NIT: 1234567890</h3>
                    </div>

                    {/* MAIN */}
                    <div className="flex items-center justify-start flex-grow">
                        <ul className="list-none">
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/')}`}>
                                <FontAwesomeIcon icon={faHouse} className="fa-1x mx-2" />
                                <Link to="/">Dashboard</Link>
                            </li>
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/productos')}`}>
                                <FontAwesomeIcon icon={faCartShopping} className="fa-1x mx-2" />
                                <Link to="/productos">Productos</Link>
                            </li>
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/ventas')}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-1x mx-2" />
                                <Link to="/ventas">Ventas</Link>
                            </li>
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/proveedores')}`}>
                                <FontAwesomeIcon icon={faTruckFast} className="fa-1x mx-2" />
                                <Link to="/proveedores">Proveedores</Link>
                            </li>
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/clientes')}`}>
                                <FontAwesomeIcon icon={faAddressBook} className="fa-1x mx-2" />
                                <Link to="/clientes">Clientes</Link>
                            </li>
                            <li className={`menu-item text-left font-semibold text-2xl ${isActive('/informes')}`}>
                                <FontAwesomeIcon icon={faChartSimple} className="fa-1x mx-2" />
                                <Link to="/informes">Informes</Link>
                            </li>
                        </ul>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-center border-t border-solid mt-auto">
                        <button className="btn-primary my-4 font-semibold" onClick={() => signOut(auth)}>
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








