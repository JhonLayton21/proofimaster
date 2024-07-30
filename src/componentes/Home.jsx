import React from 'react';
import MenuLateral from './MenuLateral';
import MenuPrincipal from './MenuPrincipal';
import BentoGrid from './BentoGrid';

const Home = ({ correoUsuario }) => {
    return (
        <div className="h-screen md:grid md:grid-cols-12 gap-0 overflow-y-auto">
            {/* MENU LATERAL */}
            <div className="hidden md:block md:col-span-2">
                <MenuLateral />
            </div>

            {/* MENU PRINCIPAL */}
            <div className="w-full h-full md:col-span-10 overflow-y-auto">
                <BentoGrid />
            </div>
        </div>
    );
};

export default Home;



