import React from "react";
import { getAuth } from 'firebase/auth';
import appFirebase from '../credenciales';
import { Link } from "react-router-dom";
import TablaProductos from "../componentes/productos/TablaProductos";
import TablaClientes from "../componentes/clientes/TablaClientes";
import TablaProveedores from "../componentes/proveedores/TablaProveedores";
import { faEllipsisV, faFileLines, faImagePortrait } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario, showTablaProductos, showTablaClientes, showTablaProveedores, titulo, subtitulo }) => {
    return (
        <>
            <div className="dark:bg-[#242424] bg-[#D3D3D3] col-span-4 md:col-span-3 p-4 md:p-8 min-w-[320px] w-full">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 dark:bg-[#292929] p-4 rounded-md space-y-4 md:space-y-0">
                    <div className="text-slate-800 dark:text-slate-50 font-bold text-2xl md:text-3xl text-left">
                        <h3>Bienvenido de nuevo, usuario</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end space-x-0 md:space-x-8 space-y-4 md:space-y-0 w-full md:w-auto">
                        <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                            <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <div className="flex-grow">
                                <p className="text-slate-800 dark:text-slate-50 text-sm font-bold text-left">Documentación</p>
                                <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">Entiende la plataforma</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                            <FontAwesomeIcon icon={faImagePortrait} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <div className="flex-grow pr-4">
                                <p className="text-sm text-slate-800 dark:text-slate-50 font-bold text-left">{correoUsuario}</p>
                                <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">Administrador</p>
                            </div>
                            <div className="relative">
                                <Link to="/configuracion" className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-500">
                                    <FontAwesomeIcon icon={faEllipsisV} className="fa-2xl text-slate-800 dark:text-slate-50" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 md:pt-16">
                    <h1 className="text-left text-slate-800 dark:text-slate-50 font-bold text-xl md:text-2xl">{titulo}</h1>
                    <h2 className="text-left text-[#757575] font-semibold text-lg md:text-xl">{subtitulo}</h2>
                </div>

                <div className="mt-8">
                    {showTablaProductos && <TablaProductos />}
                    {showTablaClientes && <TablaClientes />}
                    {showTablaProveedores && <TablaProveedores />}
                </div>
            </div>
        </>
    );
}

export default MenuPrincipal;



