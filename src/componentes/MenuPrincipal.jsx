import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from 'firebase/auth';
import appFirebase from '../credenciales';
import { Link } from "react-router-dom";
import TablaProductos from "../componentes/productos/TablaProductos";
import TablaClientes from "../componentes/clientes/TablaClientes";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario, showTablaProductos, showTablaClientes }) => {

    return (
        <>
            <div className="dark:bg-[#242424] bg-[#D3D3D3] col-span-4 md:col-span-3 p-8 min-w-[320px] w-full">
                <div className="grid grid-cols-2">
                    <div className="col-span-1">
                        <FontAwesomeIcon icon={faFileLines} className="fa-2x" />
                        <p className="text-slate-800 dark:text-slate-50 text-xl font-bold text-right">Documentación</p>
                        <p className="text-xl font-medium  text-[#757575] text-right">Entiende la plataforma</p>
                    </div>
                    <div className="col-span-1">
                        <p className="text-xl font-bold text-right">{correoUsuario} </p>
                        <p className="text-xl font-medium text-[#757575] text-right">Administrador</p>

                        <Link to="/configuracion">Configuracion</Link>
                        <button className="btn btn-primary" onClick={() => signOut(auth)}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
                {showTablaProductos && <TablaProductos />}
                {showTablaClientes && <TablaClientes />}
            </div>
            
        </>
    )
}

export default MenuPrincipal;