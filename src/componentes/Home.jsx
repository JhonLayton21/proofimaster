import React, { useState, useRef, useEffect } from 'react';
import MenuLateral from './MenuLateral';
import MenuPrincipal from './MenuPrincipal';

const Home = ({ correoUsuario }) => {

    return (
        <div className="grid grid-cols-4 gap-0 h-full">

            {/* MENU LATERAL */}
            <MenuLateral />

            {/* MENU PRINCIPAL */}
            <MenuPrincipal showTablaProductos={false} correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente a los datos guardados en Proofimaster"} />
        </div>
    );
};

export default Home;
