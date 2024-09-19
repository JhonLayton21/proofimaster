import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import GenerarInformesBoton from './GenerarInformesBoton';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { generatePDFBase, generateTable, addFooter } from './PDFUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faList, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast } from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(appFirebase);

const Informes = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    // Traer datos de los endpoints
    const fetchData = async () => {
      try {
        const resProductos = await fetch('http://localhost:5000/productos');
        const dataProductos = await resProductos.json();
        setProductos(dataProductos);

        const resVentas = await fetch('http://localhost:5000/ventas');
        const dataVentas = await resVentas.json();
        setVentas(dataVentas);

        const resClientes = await fetch('http://localhost:5000/clientes');
        const dataClientes = await resClientes.json();
        setClientes(dataClientes);

        const resProveedores = await fetch('http://localhost:5000/proveedores');
        const dataProveedores = await resProveedores.json();
        setProveedores(dataProveedores);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const generatePDF = (tipoInforme) => {
    const doc = new jsPDF({
      orientation: 'landscape', // Especificar orientación horizontal
      unit: 'mm', // Unidad de medida (opcional, por defecto es 'mm')
      format: 'a4' // Tamaño de página (opcional, por defecto es 'a4')
    });

    switch (tipoInforme) {
      case 'productos':
        // Informe de productos
        generatePDFBase(doc, "INFORME DE PRODUCTOS", "17/09/2024");
        generateTable(doc, ['ID', 'NOMBRE', 'DESCRIPCIÓN', 'FECHA', 'MIN. STOCK', 'COMPRA', 'VENTA', 'STOCK', 'MARCA', 'PROVEEDOR', 'REFERENCIA'], productos.map((producto) => [
          producto.id,
          producto.nombre,
          producto.descripcion,
          producto.fecha_entrada,
          producto.nivel_minimo_stock,
          producto.precio_compra,
          producto.precio_venta,
          producto.stock,
          producto.marca,
          producto.proveedor,
          producto.referencia
        ]));
        break;

      case 'ventas':
        // Informe de ventas
        generatePDFBase(doc, "INFORME DE VENTAS", "17/09/2024");
        generateTable(doc, ['ID', 'FECHA', 'DESCUENTO', 'NOTA', 'SUBTOTAL', 'TOTAL', 'CLIENTE', 'ESTADO', 'METODO PAGO', 'METODO ENVIO', 'PRODUCTOS'], ventas.map((venta) => [
          venta.id,
          venta.fecha_venta,
          venta.descuento_venta,
          venta.nota_venta,
          venta.subtotal,
          venta.total,
          venta.cliente,
          venta.estado,
          venta.metodo_pago,
          venta.metodo_envio,
          venta.productos
        ]));
        break;

      case 'clientes':
        // Informe de clientes
        generatePDFBase(doc, "INFORME DE CLIENTES", "17/09/2024");
        generateTable(doc, ['ID', 'NOMBRE', 'DIRECCIÓN', 'EMAIL', 'TELEFONO', 'TIPO'], clientes.map((cliente) => [
          cliente.id,
          cliente.nombre_cliente,
          cliente.direccion_cliente,
          cliente.email_cliente,
          cliente.telefono_cliente,
          cliente.tipo_cliente
        ]));
        break;

      case 'proveedores':
        // Informe de proveedores
        generatePDFBase(doc, "INFORME DE PROVEEDORES", "17/09/2024");
        generateTable(doc, ['ID', 'NOMBRE', 'CONTACTO', 'DIRECCIÓN', 'EMAIL', 'TELEFONO', 'METODO PAGO'], proveedores.map((proveedor) => [
          proveedor.id,
          proveedor.nombre_proveedor,
          proveedor.contacto_proveedor,
          proveedor.direccion_proveedor,
          proveedor.email_proveedor,
          proveedor.telefono_proveedor,
          proveedor.metodo_proveedor
        ]));
        break;

      default:
        console.error('Tipo de informe desconocido:', tipoInforme);
        return;
    }

    // Añadir pie de página y guardar el PDF
    addFooter(doc);
    doc.save(`Informe_${tipoInforme}.pdf`);
  };

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
            <GenerarInformesBoton titulo={"GENERAR INFORME PRODUCTOS"} Icon={ProductIcon} onClick={() => generatePDF('productos')} />
            <GenerarInformesBoton titulo={"GENERAR INFORME VENTAS"} Icon={SaleIcon} onClick={() => generatePDF('ventas')} />
            <GenerarInformesBoton titulo={"GENERAR INFORME CLIENTES"} Icon={ClientIcon} onClick={() => generatePDF('clientes')} />
            <GenerarInformesBoton titulo={"GENERAR INFORME PROVEEDORES"} Icon={ProviderIcon} onClick={() => generatePDF('proveedores')} />
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



