import React, { useEffect, useState } from "react";
import ModalHeader from './ModalHeader';
import DatosProductos from "./DatosProductos";
import DatosCliente from './DatosCliente';
import DatosVenta from "./DatosVenta";
import DatosPedido from "./DatosPedido";
import ModalActions from './ModalActions';
import { supabase } from '../../../supabase';

const ModalEditarVenta = ({ isOpen, onClose, editingItem }) => {
    const [formData, setFormData] = useState({
        precioVenta: "",
        clienteId: "",
        fechaVenta: "",
        estadoVentaId: "",
        metodoPagoId: "",
        descuentoVenta: 0,
        notaVenta: "",
        metodoEnvioVentaId: "",
        subtotal: 0,
        total: 0,
    });

    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // FETCH TABLAS NECESARIAS
    const fetchDataFromSupabase = async (tableName, setStateFunction) => {
        try {
            const { data, error } = await supabase.from(tableName).select('*');
            if (error) throw error;
            setStateFunction(data);
        } catch (error) {
            console.error(`Error al obtener los datos de ${tableName}`, error);
        }
    };

    useEffect(() => {
        fetchDataFromSupabase("productos", setProductos);
        fetchDataFromSupabase("clientes", setClientes);
        fetchDataFromSupabase("estado_venta", setEstadoVentas);
        fetchDataFromSupabase("metodo_pago", setMetodoPago);
        fetchDataFromSupabase("metodo_envio_venta", setMetodoEnvio);
    }, []);

    useEffect(() => {
        if (isOpen && editingItem) {
            const fetchProductosSeleccionados = async () => {
                try {
                    const { data, error } = await supabase
                        .from('venta_productos')
                        .select('*')
                        .eq('venta_id', editingItem.id); // Ajusta el nombre de la columna según tu tabla

                    if (error) throw error;

                    const productosSeleccionadosMap = data.reduce((acc, producto) => {
                        acc[producto.producto_id] = {
                            cantidad: producto.cantidad,
                            precio: producto.precio,
                        };
                        return acc;
                    }, {});

                    setProductosSeleccionados(productosSeleccionadosMap);
                } catch (error) {
                    console.error("Error al obtener productos seleccionados:", error);
                }
            };

            fetchProductosSeleccionados();

        }
    }, [isOpen, editingItem]);



    useEffect(() => {
        if (isOpen && editingItem) {
            console.log("Contenido de editingItem:", editingItem); // Verificar contenido
    
            const findByField = (list, field, value) => {
                const selectedItem = list.find((item) => item[field] === value);
                return selectedItem ? selectedItem.id.toString() : "";
            };
    
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                if (isNaN(date)) {
                    return ''; 
                }
                return date.toISOString().split('T')[0]; 
            };
    
            // Cambiar los nombres de los campos aquí
            const { 
                estado_venta, // Cambiado de estado a estado_venta
                cliente, 
                metodo_pago, 
                metodo_envio_venta, // Cambiado de metodo_envio a metodo_envio_venta
                precio_venta, 
                fecha_venta, 
                descuento_venta, 
                nota_venta, 
                subtotal, 
                total 
            } = editingItem;
    
            const precioVenta = precio_venta || "";
            const clienteId = findByField(clientes, "nombre_cliente", cliente);
            const fechaVenta = formatDate(fecha_venta) || "";
            const estadoVentaId = findByField(estadoVentas, "estado", estado_venta); // Cambiado de estado a estado_venta
            const metodoPagoId = findByField(metodoPago, "metodo", metodo_pago);
            const descuentoVenta = descuento_venta || 0;
            const notaVenta = nota_venta || "";
            const metodoEnvioVentaId = findByField(metodoEnvio, "metodo", metodo_envio_venta); // Cambiado de metodo_envio a metodo_envio_venta
            const subtotalValue = subtotal || 0;
            const totalValue = total || 0;
    
            console.log("Datos de formulario:");
            console.log("Precio de Venta:", precioVenta);
            console.log("ID de Cliente:", clienteId);
            console.log("Fecha de Venta:", fechaVenta);
            console.log("ID de Estado de Venta:", estadoVentaId);
            console.log("ID de Método de Pago:", metodoPagoId);
            console.log("Descuento de Venta:", descuentoVenta);
            console.log("Nota de Venta:", notaVenta);
            console.log("ID de Método de Envío:", metodoEnvioVentaId);
            console.log("Subtotal:", subtotalValue);
            console.log("Total:", totalValue);
    
            setFormData({
                precioVenta,
                clienteId,
                fechaVenta,
                estadoVentaId,
                metodoPagoId,
                descuentoVenta,
                notaVenta,
                metodoEnvioVentaId,
                subtotal: subtotalValue,
                total: totalValue,
            });
    
            const productosIniciales = productos.reduce((acc, producto) => {
                acc[producto.id] = {
                    cantidad: producto.cantidad,
                    precio: producto.precio_venta,
                };
                return acc;
            }, {});
    
            setProductosSeleccionados(productosIniciales);
        }
    }, [isOpen, editingItem, estadoVentas, clientes, metodoPago, metodoEnvio, productos]);
    
    
    

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const calcularTotal = () => {
        const nuevoSubtotal = calcularSubtotal();
        const descuento = (formData.descuentoVenta / 100) * nuevoSubtotal;
        const nuevoTotal = nuevoSubtotal - descuento;

        setSubtotal(nuevoSubtotal);
        setTotal(nuevoTotal);
    };

    useEffect(() => {
        calcularTotal();
    }, [productosSeleccionados, formData.metodoEnvioVentaId, formData.descuentoVenta]);

    const manejarCambioCheckbox = (producto) => {
        setProductosSeleccionados(prevState => {
            const isSelected = !!prevState[producto.id];

            if (isSelected) {
                const { [producto.id]: _, ...newState } = prevState;
                return newState;
            } else {
                return {
                    ...prevState,
                    [producto.id]: {
                        cantidad: 1, 
                        precio: producto.precio_venta,
                    },
                };
            }
        });
    };

    const manejarCambioCantidad = (productoId, cantidad) => {
        setProductosSeleccionados(prevState => ({
            ...prevState,
            [productoId]: {
                ...prevState[productoId],
                cantidad: Math.max(1, cantidad), 
            },
        }));
    };

    const manejarCambioCliente = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(cliente => cliente.id === clienteId);

        setClienteSeleccionado(cliente);

        setFormData(prevState => ({
            ...prevState,
            clienteId: clienteId
        }));
    };

    const calcularSubtotal = () => {
        const subtotalProductos = Object.values(productosSeleccionados).reduce(
            (acc, producto) => acc + producto.cantidad * producto.precio,
            0
        );

        const metodoEnvioSeleccionado = metodoEnvio.find(envio => envio.id === formData.metodoEnvioVentaId);
        const precioEnvio = metodoEnvioSeleccionado ? metodoEnvioSeleccionado.precio : 0;

        return subtotalProductos + precioEnvio;
    };

    useEffect(() => {
        const calcularTotal = () => {
            const descuento = (formData.descuentoVenta / 100) * subtotal;
            const total = subtotal - descuento;
            setTotal(total);
        };

        calcularTotal();
    }, [subtotal, formData.descuentoVenta]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const productosFiltrados = Object.entries(productosSeleccionados)
            .filter(([id, detalles]) => detalles)
            .map(([id, detalles]) => ({
                producto_id: id,
                cantidad: detalles.cantidad,
                precio: detalles.precio,
            }));
    
        try {
            // Actualiza la venta en la tabla 'ventas'
            const { data: ventaData, error: ventaError } = await supabase
                .from('ventas')
                .update({
                    ...formData,
                    clienteId: formData.cliente_id, 
                    descuentoVenta: formData.descuento_venta,
                    estadoVentaId: formData.estado_venta_id,  
                    fechaVenta: formData.fecha_venta, 
                    metodoEnvioVentaId: formData.metodo_envio_venta_id, 
                    metodoPagoId: formData.metodo_pago_id, 
                    notaVenta: formData.nota_venta, 
                    precioVenta: formData.precio_venta, 
                    subtotal: formData.subtotal,
                    total: formData.total,
                })
                .eq('id', editingItem.id);
    
            if (ventaError) throw ventaError;
    
            // Eliminar productos existentes de la venta y volver a insertarlos
            await supabase.from('venta_productos').delete().eq('venta_id', editingItem.id);
    
            // Insertar los nuevos productos
            const { error: productosError } = await supabase
                .from('venta_productos')
                .insert(productosFiltrados.map(producto => ({
                    venta_id: editingItem.id,
                    ...producto,
                })));
    
            if (productosError) throw productosError;
    
            console.log("Venta editada:", ventaData);
            onClose(); // Cerrar modal después de la edición
    
        } catch (err) {
            console.error("Error al editar la venta:", err);
        }
    };
    


    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">

                        {/* Encabezado del Modal */}
                        <ModalHeader title="Editar venta" onClose={onClose} />

                        {/* Contenido del Modal */}
                        <div className="relative p-6 flex-auto dark:bg-[#242424] bg-[#eeeeee]">
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                                {/* DATOS PRODUCTOS */}
                                <DatosProductos
                                    productos={productos}
                                    productosSeleccionados={productosSeleccionados}
                                    manejarCambioCheckbox={manejarCambioCheckbox}
                                    manejarCambioCantidad={manejarCambioCantidad}
                                />

                                {/* DATOS CLIENTE */}
                                <DatosCliente
                                    clientes={clientes}
                                    formData={formData}
                                    manejarCambioCliente={manejarCambioCliente}
                                    clienteSeleccionado={clienteSeleccionado}
                                />

                                {/* DATOS VENTA */}
                                <DatosVenta
                                    formData={formData}
                                    handleEditInputChange={handleEditInputChange}
                                    estadoVentas={estadoVentas}
                                    metodoPago={metodoPago}
                                />

                                {/* DATOS PEDIDO */}
                                <DatosPedido
                                    formData={formData}
                                    handleEditInputChange={handleEditInputChange}
                                    metodoEnvio={metodoEnvio}
                                />

                                {/* Botones de acción */}
                                <ModalActions onClose={onClose} />

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ModalEditarVenta;
