import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from 'firebase/auth';
import appFirebase from '../credenciales';
import { Link } from "react-router-dom";
import TablaProductos from "../componentes/productos/TablaProductos";
import TablaClientes from "../componentes/clientes/TablaClientes";
import TablaProveedores from "../componentes/proveedores/TablaProveedores";
import { faEllipsisV, faFileLines, faImagePortrait, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario, showTablaProductos, showTablaClientes, showTablaProveedores, titulo, subtitulo }) => {

    return (
        <>
            <div className="dark:bg-[#242424] bg-[#D3D3D3] col-span-4 md:col-span-3 p-8 min-w-[320px] w-full">
                <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faSearch} className=" mr-2 fa-xl" />
                        <input type="text" placeholder="Buscar..." className="bg-gray-100 outline-none" />
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2 mx-8 cursor-pointer">
                            <FontAwesomeIcon icon={faFileLines} className="text-slate-800 fa-2xl" />
                            <div>
                                <p className="text-slate-800 dark:text-slate-50 text-base font-bold text-left">Documentación</p>
                                <p className="text-base font-medium text-[#757575]">Entiende la plataforma</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <FontAwesomeIcon icon={faImagePortrait} className="text-slate-800 fa-2xl" />
                            <div className="pr-8">
                                <p className="text-base text-slate-800 dark:text-slate-50 font-bold">{correoUsuario}</p>
                                <p className="text-base font-medium text-[#757575] text-left">Administrador</p>
                            </div>
                            <div className="relative">
                                
                                <Link to="/configuracion" className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-500">
                                    <FontAwesomeIcon icon={faEllipsisV} className="fa-2xl text-slate-800" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-left text-slate-800 font-bold pt-16">{titulo}</h1>
                    <h2 className="text-left text-[#757575] font-semibold">{subtitulo}</h2>
                </div>

                {showTablaProductos && <TablaProductos />}
                {showTablaClientes && <TablaClientes />}
                {showTablaProveedores && <TablaProveedores />}
            </div>

        </>
    )
}

export default MenuPrincipal;