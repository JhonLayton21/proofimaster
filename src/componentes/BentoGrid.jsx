import React from "react";
import MenuPrincipal from "./MenuPrincipal";

const BentoGrid = ({ correoUsuario }) => {
    return (
        <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente a los datos guardados en Proofimaster"} >
            <div className="grid grid-cols-12 grid-rows-4 gap-2 mt-8 px-2 md:px-0 ">
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">
                    <h2 className="text-lg font-bold mb-4">Productos principales</h2>
                    <ol className="list-decimal list-inside mb-4 px-4 ">
                        <li className="py-1 border-b border-gray-300 font-light">Silla Ergónomica</li>
                        <li className="py-1 border-b border-gray-300 font-light">Silla Ejecutiva</li>
                        <li className="py-1 border-b border-gray-300 font-light">Silla de Oficina</li>
                        <li className="py-1 border-b border-gray-300 font-light">Silla de Reunión</li>
                        <li className="py-1 border-b border-gray-300 font-light">Silla Gaming</li>
                        <li className="py-1 font-light">Silla de Estudio</li>
                    </ol>
                </div>
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">Total de ventas</div>
                <div className="bentoItem col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 !bg-yellow-400">Alertas de stock</div>
                <div className="bentoItem col-span-6 lg:col-span-2">Proveedores</div>
                <div className="bentoItem col-span-6 lg:col-span-2">Clientes frecuentes</div>
                <div className="bentoItem col-span-6 lg:col-span-8 row-span-1 lg:row-span-2 !bg-sky-200">Informes generados</div>
                <div className="bentoItem col-span-12 lg:col-span-4 row-span-1 lg:row-span-1">Usuarios activos</div>
            </div>
        </MenuPrincipal>
    );
}

export default BentoGrid;