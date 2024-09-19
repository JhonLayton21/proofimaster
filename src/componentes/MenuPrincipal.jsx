import React, { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import MainContent from "./dashboard/MainContent";
import appFirebase from '../credenciales';

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario, titulo, subtitulo, children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [open, setOpen] = useState(0);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const isActive = (path) => {
        return window.location.pathname === path ? 'active' : '';
    };

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || user.email);
        }
    }, []);
    
    return (
        <>
            <div className="dark:bg-[#242424] bg-[#eeeeee] md:p-8 min-w-[320px] w-full min-h-screen overflow-auto transition-all duration-300">
                
                {/* SIDEBAR */}
                <Sidebar isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} open={open} handleOpen={handleOpen} isActive={isActive} />
                
                {/* MENU PRINCIPAL */}
                <div className={`flex-grow p-4 overflow-hidden relative ${isDrawerOpen ? 'blurred-background' : ''}`}>
                    <Header userName={userName} correoUsuario={correoUsuario} isDrawerOpen={isDrawerOpen} openDrawer={openDrawer} />
                    <MainContent titulo={titulo} subtitulo={subtitulo} > 
                        {children}
                    </MainContent> 
                </div>
            </div>
        </>
    );
}

export default MenuPrincipal;







