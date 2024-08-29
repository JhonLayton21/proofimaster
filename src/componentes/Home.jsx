import React from 'react';
import MenuLateral from './MenuLateral';
import MenuPrincipal from './MenuPrincipal';
import BentoGrid from './BentoGrid';

const Home = ({ correoUsuario }) => {
    return (
        <div className="h-screen grid-cols-12 gap-0 overflow-y-auto">

            {/* MENU PRINCIPAL */}
            <div className="w-full h-full col-span-12 overflow-y-auto">
                <BentoGrid correoUsuario={correoUsuario} />
            </div>
        </div>
    );
};

export default Home;



