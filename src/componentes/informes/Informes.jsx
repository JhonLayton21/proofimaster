import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import GenerarInformesBoton from './GenerarInformesBoton';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { generatePDFBase, generateTable, addFooter } from './PDFUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faList, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast, faDownload } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabase';
import SearchBar from "../SearchBar";

const auth = getAuth(appFirebase);

const Informes = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [informes, setInformes] = useState([]);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
  const [limit, setLimit] = useState(10); // Estado para el límite de registros

  const fetchData = async (limit) => {
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

      // Obtener informes desde la tabla "informes"
      const { data: dataInformes, error: errorInformes } = await supabase
        .from('informes')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);

      if (errorInformes) throw errorInformes;
      setInformes(dataInformes);
    } catch (error) {
      console.error('Error mostrando datos:', error);
    }
  };

  const generatePDF = async (tipoInforme) => {
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

    try {
      // Generar el PDF según el tipo de informe
      switch (tipoInforme) {
        case 'productos':
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
          generatePDFBase(doc, "INFORME DE CLIENTES", `${fechaActual}`);
          generateTable(doc, ['ID', 'NUM. IDENTIFICACIÓN', 'NOMBRE', 'DIRECCIÓN', 'CIUDAD', 'TELEFONO', 'TIPO'], clientes.map((cliente) => [
            cliente.id,
            cliente.numero_identificacion,
            cliente.nombre_cliente,
            cliente.direccion_cliente,
            cliente.ciudad,
            cliente.telefono_cliente,
            cliente.tipo_clientes.tipo
          ]));
          break;

        case 'proveedores':
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

      // Añadir pie de página
      addFooter(doc);

      // Convertir el PDF a un Blob
      const pdfBlob = doc.output('blob');
      const pdfFileName = `uploads/Informe_${tipoInforme}_${Date.now()}.pdf`;

      // Subir el archivo a Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('informes')
        .upload(pdfFileName, pdfBlob);

      if (uploadError) throw uploadError;

      // Guardar el informe en la tabla 'informes'
      const { error: insertError } = await supabase
        .from('informes')
        .insert([
          { nombre: `Informe de ${tipoInforme}`, url_archivo: `https://qgonmnacqpgrlbwzeymg.supabase.co/storage/v1/object/public/informes/${pdfFileName}` }
        ]);

      if (insertError) throw insertError;

      // Crear un objeto URL para el PDF y abrirlo en una nueva pestaña
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Alerta de éxito
      setAlerta({
        mostrar: true,
        mensaje: 'Informe generado y guardado exitosamente. Consulta la tabla de informes.',
        tipo: 'exito'
      });
    } catch (error) {
      // Alerta de error
      setAlerta({
        mostrar: true,
        mensaje: 'Error generando el informe. Prueba nuevamente.',
        tipo: 'error'
      });
    } finally {
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlerta({ mostrar: false, mensaje: '', tipo: '' });
      }, 5000);
    }
};


  const handleSearchResults = (resultados) => {
    setInformes(resultados); // Actualizar los datos con los resultados de la búsqueda
  };

  // Componentes de iconos
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

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleString('es-ES', options); // Cambia 'es-ES' por tu localización preferida
  };

  const userEmail = auth.currentUser ? auth.currentUser.email : '';

  useEffect(() => {
    fetchData(limit);

    const channel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'informes' },
        (payload) => fetchData(limit)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return (
    <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
      <div className="col-span-12">
        <MenuPrincipal
          correoUsuario={userEmail}
          showTablaProductos={false}
          titulo={"INFORMES"}
          subtitulo={"Impulsa tu negocio con reportes e informes detallados"}
        >
          {/* Alerta */}
          {alerta.mostrar && (
            <div className={`p-4 mb-4 text-sm rounded-lg ${alerta.tipo === 'error' ? 'text-red-600 bg-red-100 border-red-400' : 'text-green-600 bg-green-100 border-green-400'}`} role="alert">
              <span className="font-medium">{alerta.tipo === 'error' ? 'Error' : 'Éxito'}:</span> {alerta.mensaje}
            </div>
          )}

          {/* CONTENIDO DE INFORMES */}
          <div className="grid grid-cols-12 gap-0 h-full p-8 pb-0 overflow-auto">
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

          <SearchBar
            placeholder="Buscar informes..."
            rpcFunctionAll="obtener_informes"
            rpcFunctionSearch="buscar_informes"
            searchParams="search_query"
            onSearchResults={handleSearchResults}
          />

          <div className="my-4">
            <label htmlFor="resultLimit" className="mr-2">Mostrar:</label>
            <select
              id="resultLimit"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="p-2 border rounded"
            >
              <option className="bg-orange-500" value={5}>5 resultados</option>
              <option className="bg-orange-500" value={10}>10 resultados</option>
              <option className="bg-orange-500" value={15}>15 resultados</option>
              <option className="bg-orange-500" value={20}>20 resultados</option>
            </select>
          </div>

          <div className="relative overflow-x-auto rounded-2xl mt-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-slate-50 uppercase bg-[#f97316]">
                <tr>
                  <th className="px-6 py-3">ID informe</th>
                  <th className="px-6 py-3">Nombre informe</th>
                  <th className="px-6 py-3">Fecha creación</th>
                  <th className="px-6 py-3">Descargar PDF</th> {/* Nueva columna */}
                </tr>
              </thead>
              <tbody>
                {informes.map((informe, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                    <td className="px-6 py-4">{informe.id}</td>
                    <td className="px-6 py-4">{informe.nombre}</td>
                    <td className="px-6 py-4">{formatDate(informe.fecha_creacion)}</td>
                    <td className="px-6 py-4">
                      {/* Botón de descarga usando la url_archivo */}
                      <a
                        href={informe.url_archivo} // La URL del archivo
                        download // Atributo para forzar la descarga
                        className="text-orange-600 hover:underline m-1 cursor-pointer"
                        target='_blank'
                        rel="noopener noreferrer" // Add this for security
                      >
                        Descargar
                        <FontAwesomeIcon icon={faDownload} className="ml-1" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </MenuPrincipal>
      </div>
    </div>
  );
};

export default Informes;







