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
          .select('*, clientes (nombre_cliente), estado_venta (estado), metodo_pago (metodo), metodo_envio_venta (metodo), venta_productos ( productos (nombre) )');
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

  const generatePDF = (tipoInforme) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const fechaActual = new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
  });

    switch (tipoInforme) {
      case 'productos':
        // Informe de productos
        generatePDFBase(doc, "INFORME DE PRODUCTOS", `${fechaActual}`);
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
        generatePDFBase(doc, "INFORME DE VENTAS", `${fechaActual}`);
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
          venta.venta_productos.map(vp => vp.productos.nombre).join(', ')
        ]));
        break;

      case 'clientes':
        // Informe de clientes
        generatePDFBase(doc, "INFORME DE CLIENTES", `${fechaActual}`);
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
        generatePDFBase(doc, "INFORME DE PROVEEDORES", `${fechaActual}`);
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
    doc.save(`Informe_${tipoInforme}.pdf`);
  };

  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  const ProductIcon = () => (
    <FontAwesomeIcon icon={faCartShopping} className="fa-2xl m-4 text-orange-500" />
  );

  const SaleIcon = () => (
    <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-2xl m-4 text-orange-500" />
  );

  const ClientIcon = () => (
    <FontAwesomeIcon icon={faAddressBook} className="fa-2xl m-4 text-orange-500" />
  );

  const ProviderIcon = () => (
    <FontAwesomeIcon icon={faTruckFast} className="fa-2xl m-4 text-orange-500" />
  );

  return (
    <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
      <div className="col-span-12">
        <MenuPrincipal
          correoUsuario={userEmail}
          showTablaProductos={false}
          titulo={"INFORMES"}
          subtitulo={"Impulsa tu negocio con reportes e informes detallados"}
        >
          {/* CONTENIDO DE INFORMES */}
          <div className="grid grid-cols-12 gap-0 h-full p-8 overflow-auto">
            <div className="col-span-12 mx-auto">
              {/* BOTONES GENERAR INFORMES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 cursor-pointer">
                <GenerarInformesBoton
                  titulo={"GENERAR INFORME PRODUCTOS"}
                  Icon={ProductIcon}
                  onClick={() => generatePDF('productos')}
                />
                <GenerarInformesBoton
                  titulo={"GENERAR INFORME VENTAS"}
                  Icon={SaleIcon}
                  onClick={() => generatePDF('ventas')}
                />
                <GenerarInformesBoton
                  titulo={"GENERAR INFORME CLIENTES"}
                  Icon={ClientIcon}
                  onClick={() => generatePDF('clientes')}
                />
                <GenerarInformesBoton
                  titulo={"GENERAR INFORME PROVEEDORES"}
                  Icon={ProviderIcon}
                  onClick={() => generatePDF('proveedores')}
                />
              </div>
            </div>
          </div>

        </MenuPrincipal>
      </div>
    </div>
  )
}

export default Informes;






