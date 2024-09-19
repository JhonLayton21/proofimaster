import React from 'react';
import { IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MenuCuenta from "./MenuCuenta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faImagePortrait } from '@fortawesome/free-solid-svg-icons';

const Header = ({ userName, correoUsuario, isDrawerOpen, openDrawer }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-[#292929] p-4 rounded-md space-y-4 md:space-y-0 m-2 md:m-0 shadow-lg">
            <IconButton
                variant="text"
                size="lg"
                onClick={openDrawer}
                className=" dark:bg-[#242424] hover:border-[#ff6f00] shadow-xl flex justify-center items-center"
            >
                {isDrawerOpen ? (
                    <XMarkIcon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                ) : (
                    <Bars3Icon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                )}
            </IconButton>

            <div className="text-[#ff6f00] font-bold text-2xl md:text-3xl text-left">
                <h3>Bienvenido de nuevo, {userName || "usuario"}</h3>
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
                </div>
                <div className="relative">
                    <MenuCuenta />
                </div>
            </div>
        </div>
    );
};

export default Header;