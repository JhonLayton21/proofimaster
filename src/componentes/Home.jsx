import React from 'react';
import MenuLateral from './MenuLateral';
import MenuPrincipal from './MenuPrincipal';

const Home = ({ correoUsuario }) => {
    return (
        <div className="h-screen md:grid md:grid-cols-12 gap-0">
            {/* MENU LATERAL */}
            <div className="hidden md:block md:col-span-2">
                <MenuLateral />
            </div>

            {/* MENU PRINCIPAL */}
            <div className="w-full h-full md:col-span-10">
                <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente a los datos guardados en Proofimaster"} />
            </div>
        </div>
    );
};

export default Home;


