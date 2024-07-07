import React, { useState, useRef, useEffect } from 'react';
import MenuLateral from './MenuLateral';
import MenuPrincipal from './MenuPrincipal';

const Home = ({ correoUsuario }) => {

    return (
        <div className="grid grid-cols-4 gap-0 h-full">

            {/* MENU LATERAL */}
            <MenuLateral />

            {/* MENU PRINCIPAL */}
            <MenuPrincipal />
        </div>
    );
};

export default Home;
