import React from "react";
import MenuLateral from "./MenuLateral";
import MenuPrincipal from "./MenuPrincipal";

export default function Configuracion() {

  return (
    <>
      <div className="grid grid-cols-12 gap-0 h-full">

        {/* MENU LATERAL */}
        <div className="md:col-span-2">
          <MenuLateral />
        </div>

        {/* MENU PRINCIPAL */}
        <div className="col-span-12 md:col-span-10">
          <MenuPrincipal titulo="CONFIGURACION" subtitulo="Ajusta las configuraciones de tu cuenta">
            <div>
              <div className="mt-6 border-t border-gray-300">
                <dl className="divide-y divide-gray-300">
                  <h2 className="text-orange-500 text-xl font-medium">CONFIGURACIÓN BÁSICA</h2>
                  <div className="flex items-center px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Foto de perfil</dt>
                    <dd className="flex justify-center items-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <div className="text-gray-500">Sin foto</div>
                      </div>
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Rol</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Estado</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Nombre completo</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Dirección de correo</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Correo electrónico verificado</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"></dd>
                  </div>
                </dl>
              </div>
            </div>
          </MenuPrincipal>
        </div>




      </div>
    </>
  );
}
