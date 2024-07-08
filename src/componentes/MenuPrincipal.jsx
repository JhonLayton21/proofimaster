import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from 'firebase/auth';
import appFirebase from '../credenciales';
import { Link } from "react-router-dom";

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario }) => {

    return (
        <>
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
            </div>
        </>
    )
}

export default MenuPrincipal;