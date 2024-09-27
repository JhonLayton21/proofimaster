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
import { supabase } from '../../../supabase';

const auth = getAuth(appFirebase);

const Informes = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [informes, setInformes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos desde la tabla "productos"
        const { data: dataProductos, error: errorProductos } = await supabase
          .from('productos')
          .select('*, marcas_productos (nombre), referencias_productos (codigo), proveedores (nombre_proveedor)');
        if (errorProductos) throw errorProductos;
        setProductos(dataProductos);

        // Obtener ventas desde la tabla "ventas"
        const { data: dataVentas, error: errorVentas } = await supabase
          .from('ventas')
          .select('*, clientes (nombre_cliente), estado_venta (estado), metodo_pago (metodo), metodo_envio_venta (metodo)');
        if (errorVentas) throw errorVentas;
        setVentas(dataVentas);

        // Obtener clientes desde la tabla "clientes"
        const { data: dataClientes, error: errorClientes } = await supabase
          .from('clientes')
          .select('*, tipo_clientes (tipo)');
        if (errorClientes) throw errorClientes;
        setClientes(dataClientes);

        // Obtener proveedores desde la tabla "proveedores"
        const { data: dataProveedores, error: errorProveedores } = await supabase
          .from('proveedores')
          .select('*, metodo_pago (metodo)');
        if (errorProveedores) throw errorProveedores;
        setProveedores(dataProveedores);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const generatePDF = async (tipoInforme) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
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
          producto.marcas_productos.nombre,
          producto.proveedores.nombre_proveedor,
          producto.referencias_productos.codigo
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
          venta.clientes.nombre_cliente,
          venta.estado_venta.estado,
          venta.metodo_pago.metodo,
          venta.metodo_envio_venta.metodo,
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
          cliente.tipo_clientes.tipo
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
          proveedor.metodo_pago.metodo
        ]));
        break;

      default:
        console.error('Tipo de informe desconocido:', tipoInforme);
        return;
    }

    // Añadir pie de página y guardar el PDF
    addFooter(doc);

    // Convertir el PDF a Blob
    const pdfBlob = doc.output('blob');
    const fileName = `Informe_${tipoInforme}_${Date.now()}.pdf`;

    // Utilizar la función uploadToSupabase
    await uploadToSupabase(pdfBlob, fileName);

    // Obtener la URL del archivo subido
    const fileUrl = supabase.storage.from('informes').getPublicUrl(`informes/${fileName}`).data.publicUrl;

    // Guardar los metadatos del informe
    await saveReportMetadata(fileName, fileUrl);
  };

  const uploadToSupabase = async (file, fileName) => {
    const { data, error } = await supabase.storage
      .from('informes')
      .upload(`informes/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      console.log('File uploaded successfully:', data);
    }
  };


  const saveReportMetadata = async (fileName, fileUrl) => {
    const { data, error } = await supabase
      .from('informes')
      .insert([{ nombre: fileName, url_archivo: fileUrl, fecha_creacion: new Date() }]);

    if (error) {
      console.error('Error saving report metadata:', error.message);
    } else {
      console.log('Report metadata saved:', data);
    }
  };

  useEffect(() => {
    const fetchInformes = async () => {
      const { data, error } = await supabase
        .from('informes')
        .select('*')
        .order('fecha_creacion', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching reports:', error.message);
      } else {
        setInformes(data);
      }
    };

    fetchInformes();
  }, []);




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
    <FontAwesomeIcon icon={faAddressBook} className="fa-1x mx-4 text-orange-500" />
  );

  const ProviderIcon = () => (
    <FontAwesomeIcon icon={faTruckFast} className="fa-1x mx-4 text-orange-500" />
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
            {informes.map((informe, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-[#757575]">{informe.nombre}</h2>
                </div>
                <div className="flex space-x-2">
                  <a href={informe.url_archivo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600">
                    Descargar PDF
                  </a>
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



