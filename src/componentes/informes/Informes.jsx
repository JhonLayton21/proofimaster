import React from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import GenerarInformesBoton from './GenerarInformesBoton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faList, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast } from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(appFirebase);

const Informes = () => {
  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  const createdReports = [
    { name: "Report 1" },
    { name: "Report 2" },
    { name: "Report 3" },
    { name: "Report 4" },
  ];

  const ProductIcon = () => (
    <FontAwesomeIcon icon={faCartShopping} className="fa-1x mx-4 text-orange-500" />
  );

  const SaleIcon = () => (
    <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-1x mx-4 text-orange-500" />
  );

  const ClientIcon = () => (
    <FontAwesomeIcon icon={faTruckFast} className="fa-1x mx-4 text-orange-500" />
  );

  const ProviderIcon = () => (
    <FontAwesomeIcon icon={faAddressBook} className="fa-1x mx-4 text-orange-500" />
  );

  return (
    <MenuPrincipal
      correoUsuario={userEmail}
      showTablaProductos={false}
      titulo={"INFORMES"}
      subtitulo={"Impulsa tu negocio con reportes e informes detallados"}
    >
      {/* CONTENIDO DE INFORMES */}
      <div className="grid grid-cols-12 gap-0 h-full p-8 overflow-auto">
        <div className="col-span-12 max-w-4xl mx-auto">
          {/* BOTONES GENERAR INFORMES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 cursor-pointer">
            <GenerarInformesBoton titulo={"GENERAR INFORME PRODUCTOS"} Icon={ProductIcon} />
            <GenerarInformesBoton titulo={"GENERAR INFORME VENTAS"} Icon={SaleIcon} />
            <GenerarInformesBoton titulo={"GENERAR INFORME CLIENTES"} Icon={ClientIcon} />
            <GenerarInformesBoton titulo={"GENERAR INFORME PROVEEDORES"} Icon={ProviderIcon} />
          </div>

          {/* TABLA INFORMES */}
          <div className="bg-white dark:bg-[#292929] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">INFORMES CREADOS</h2>
            {createdReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-[#757575]">{report.name}</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600">
                    .XLSX
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600">
                    .PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MenuPrincipal>
  );
};

export default Informes;



