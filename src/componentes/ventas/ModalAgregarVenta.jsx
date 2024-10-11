import React, { useState, useEffect } from "react";
import { faCircleUser, faFileLines, faBell, faEnvelope, faGear, faImagePortrait } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../../../supabase';

const ModalAgregarVenta = ({ isOpen, onClose }) => {
    const [newSale, setNewSale] = useState({
        productoId: 0,
        clienteId: 0,
        fechaVenta: '',
        estadoVentaId: 0,
        metodoPagoId: 0,
        descuentoVenta: 0,
        notaVenta: '',
        metodoEnvioVentaId: 0,
        subtotal: 0,
        total: 0
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
    // Función para obtener datos desde Supabase
    const fetchDataFromSupabase = async (tableName, setStateFunction) => {
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) {
            console.error(`Error al obtener los datos de ${tableName}:`, error);
        } else {
            setStateFunction(data);
            console.log(data);
        }
    };

    // FECTCH TABLAS NECESARIAS
    useEffect(() => {
        fetchDataFromSupabase("productos", setProductos);
        fetchDataFromSupabase("clientes", setClientes);
        fetchDataFromSupabase("estado_venta", setEstadoVentas);
        fetchDataFromSupabase("metodo_pago", setMetodoPago);
        fetchDataFromSupabase("metodo_envio_venta", setMetodoEnvio);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        console.log(`Campo: ${name}, Valor: ${value}`);
        setNewSale({
            ...newSale,
            [name]: value,
        });
    };

    const calcularTotal = (subtotal, descuentoVenta) => {
        const descuento = ((descuentoVenta || 0) / 100) * subtotal;
        const total = subtotal - descuento;
        return total ? total : 0;
    };


    useEffect(() => {
        const nuevoSubtotal = calcularSubtotal();
        setSubtotal(nuevoSubtotal);
        const nuevoTotal = calcularTotal(nuevoSubtotal, newSale.descuento_venta);
        setTotal(nuevoTotal);

        // Actualizar el estado de newSale con subtotal y total
        setNewSale(prevState => ({
            ...prevState,
            subtotal: nuevoSubtotal,
            total: nuevoTotal,
        }));
    }, [productosSeleccionados, newSale.metodoEnvioVentaId, newSale.descuento_venta]);


    // Manejar cambios en checboxes productos
    const manejarCambioCheckbox = (producto) => {
        setProductosSeleccionados(prevState => {
            const isSelected = !!prevState[producto.id];

            if (isSelected) {
                // Eliminar producto del estado si está seleccionado
                const { [producto.id]: _, ...newState } = prevState;
                return newState;
            } else {
                // Añadir producto al estado si no está seleccionado
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


    useEffect(() => {
        console.log("Productos seleccionados actualizados:");
        Object.entries(productosSeleccionados).forEach(([id, detalles]) => {
            console.log(`ID: ${id}, Cantidad: ${detalles.cantidad}, Precio: ${detalles.precio}`);
        });
    }, [productosSeleccionados]);



    // Manejar cambios de cantidad productos
    const manejarCambioCantidad = (productoId, cantidad) => {
        setProductosSeleccionados(prevState => ({
            ...prevState,
            [productoId]: {
                ...prevState[productoId],
                cantidad: Math.max(1, cantidad), // Asegúrate de que la cantidad sea al menos 1
            },
        }));
    };

    // Manejar cambio información cliente
    const manejarCambioCliente = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(cliente => cliente.id === clienteId);

        setClienteSeleccionado(cliente);

        setNewSale(prevState => ({
            ...prevState,
            clienteId: clienteId
        }));
    };


    // Calcular subtotal
    const calcularSubtotal = () => {
        // Calcular subtotal de productos seleccionados
        const subtotalProductos = Object.values(productosSeleccionados).reduce(
            (acc, producto) => acc + producto.cantidad * producto.precio, 0
        );

        console.log("Subtotal actual:", subtotalProductos);

        // Obtener el precio del método de envío seleccionado
        const metodoEnvioSeleccionado = metodoEnvio.find(envio => envio.id === newSale.metodoEnvioVentaId);
        const precioEnvio = metodoEnvioSeleccionado ? metodoEnvioSeleccionado.precio * 1000 : 0;
        console.log("Precio del método de envío seleccionado:", precioEnvio);
        console.log('Método de envío seleccionado:', newSale.metodoEnvioVentaId);


        // Asegurarse de que subtotalProductos también sea un número (aunque debería serlo)
        const subtotal = parseFloat(subtotalProductos) + parseFloat(precioEnvio);
        return subtotal;
    };

    // Calcular Total
    useEffect(() => {
        const calcularTotal = () => {
            const descuento = (newSale.descuentoVenta / 100) * subtotal;
            const total = subtotal - descuento;
            setTotal(total);
        };

        calcularTotal();
    }, [subtotal, newSale.descuentoVenta]);

    // consulta para verificacion de cantidad de Stock en tabla productos
    const verificarStockDisponible = async (productosSeleccionados) => {
        const productosConStockInsuficiente = [];

        for (const [productoId, detalles] of Object.entries(productosSeleccionados)) {
            const { data: productoData, error: productoError } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', productoId)
                .single();

            if (productoError) {
                console.error(`Error al verificar el stock del producto ${productoId}:`, productoError);
                return false;
            }

            if (productoData.stock < detalles.cantidad) {
                productosConStockInsuficiente.push({ id: productoId, stockDisponible: productoData.stock });
            }

        }

        if (productosConStockInsuficiente.length > 0) {
            console.error("Stock insuficiente para los siguientes productos:", productosConStockInsuficiente);
            return false;
        }

        return true;
    }

    const actualizarStockProductos = async (productosSeleccionados) => {
        for (const [productoId, detalles] of Object.entries(productosSeleccionados)) {
            const { data: productoData, error: productoError } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', productoId)
                .single();

            if (productoError) {
                console.error(`Error al obtener el stock actual del producto ${productoId}:`, productoError);
                continue; // Puedes manejar el error según sea necesario
            }

            const nuevoStock = productoData.stock - detalles.cantidad;

            const { error: updateError } = await supabase
                .from('productos')
                .update({ stock: nuevoStock })
                .eq('id', productoId);

            if (updateError) {
                console.error(`Error al actualizar el stock del producto ${productoId}:`, updateError);
                throw new Error(`Error al actualizar el stock del producto ${productoId}`);
            }
        }
    };



    // Envio info del formulario de ventas
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Muestra los productos seleccionados para depuración
        console.log("Productos seleccionados:", productosSeleccionados);
    
        const productosFiltrados = Object.entries(productosSeleccionados)
            .filter(([id, detalles]) => detalles)
            .map(([id, detalles]) => ({
                producto_id: id,
                cantidad: detalles.cantidad,
                precio: detalles.precio
            }));
    
        // Muestra los productos filtrados que se insertarán
        console.log("Productos filtrados para la venta:", productosFiltrados);
    
        try {
            // Muestra los datos de la venta antes de la inserción
            console.log("Datos de la venta a insertar:", {
                cliente_id: newSale.clienteId,
                fecha_venta: newSale.fechaVenta,
                estado_venta_id: newSale.estadoVentaId,
                metodo_pago_id: newSale.metodoPagoId,
                descuento_venta: newSale.descuentoVenta,
                nota_venta: newSale.notaVenta,
                metodo_envio_venta_id: newSale.metodoEnvioVentaId,
                subtotal: subtotal,
                total: total,
            });
    
            // Verificar cantidad de stock antes de procesar la venta
            const stockDisponible = await verificarStockDisponible(productosSeleccionados);
            if (!stockDisponible) {
                alert("Stock insuficiente para uno o más productos.");
                return;
            }
    
            // Inserta la venta en Supabase
            const { data: ventaData, error: ventaError } = await supabase
                .from('ventas')
                .insert([{
                    cliente_id: parseInt(newSale.clienteId, 10),
                    fecha_venta: newSale.fechaVenta,
                    estado_venta_id: parseInt(newSale.estadoVentaId, 10),
                    metodo_pago_id: parseInt(newSale.metodoPagoId, 10),
                    descuento_venta: newSale.descuentoVenta,
                    nota_venta: newSale.notaVenta,
                    metodo_envio_venta_id: parseInt(newSale.metodoEnvioVentaId, 10),
                    subtotal: subtotal,
                    total: total,
                }])
                .select();
    
            if (ventaError) {
                console.error("Error al agregar la venta en Supabase:", ventaError);
                throw new Error("Error al agregar la venta");
            }
    
            console.log("Datos de la venta insertados en Supabase:", ventaData);
    
            if (!ventaData || ventaData.length === 0) {
                console.error("Error: ventaData está vacío o es null");
                return;
            }
    
            console.log("ID de la venta insertada:", ventaData[0].id);
    
            // Inserta los productos de la venta en Supabase
            const { error: productosError } = await supabase
                .from('venta_productos')
                .insert(productosFiltrados.map(producto => ({
                    venta_id: ventaData[0].id,
                    producto_id: producto.producto_id,
                    cantidad: producto.cantidad,
                    precio: producto.precio,
                })));
    
            if (productosError) {
                console.error("Error al agregar los productos de la venta en Supabase:", productosError);
                throw new Error("Error al agregar los productos de la venta");
            }
    
            // Solo actualiza el stock si el estado de la venta es "Completado"
            const estadoVentaCompletadoId = 1; // Reemplaza con el ID real de "Completado"
            if (parseInt(newSale.estadoVentaId, 10) === estadoVentaCompletadoId) {
                // Actualizar stock productos
                await actualizarStockProductos(productosSeleccionados);
                console.log("Stock de productos actualizado.");
            } else {
                console.log("La venta no está completada, el stock no se ha actualizado.");
            }
    
            // Si todo fue exitoso, muestra los datos completos
            console.log("Venta y productos agregados exitosamente:", {
                venta: ventaData,
                productos: productosFiltrados
            });
    
            // Cierra el modal
            onClose();
        } catch (err) {
            console.error("Error al agregar la venta:", err);
        }
    };
    

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424] bg-[#eeeeee]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Agregar Venta
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto dark:bg-[#242424] bg-[#eeeeee]">
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                                {/* DATOS PRODUCTOS */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929] flex flex-col">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Productos</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {productos.map(producto => (
                                            <div key={producto.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={producto.id}
                                                    name="productoId"
                                                    checked={!!productosSeleccionados[producto.id]}
                                                    onChange={() => manejarCambioCheckbox(producto)}
                                                    className="m-2"
                                                />
                                                <label htmlFor={producto.id} className="text-left flex-grow text-[#757575] dark:text-[#757575]">
                                                    {producto.nombre} - {parseFloat(producto.precio_venta).toFixed(0)} COP
                                                </label>
                                                {productosSeleccionados[producto.id] && (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={productosSeleccionados[producto.id].cantidad}
                                                        onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                                                        className="input-class ml-6 text-[#757575]"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {/* DATOS CLIENTE */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Cliente</h3>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]" onChange={manejarCambioCliente} name="clienteId" value={newSale.cliente_id}>
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>{cliente.nombre_cliente}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center justify-center mb-4">
                                        <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                                    </div>
                                    {clienteSeleccionado && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="md:col-span-2 flex justify-center">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre"
                                                    value={clienteSeleccionado.nombre_cliente}
                                                    disabled
                                                    className="w-full md:w-1/2 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Correo"
                                                value={clienteSeleccionado.email_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Teléfono"
                                                value={clienteSeleccionado.telefono_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Dirección"
                                                value={clienteSeleccionado.direccion_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Método de pago"
                                                value={clienteSeleccionado.tipo_cliente_id}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* DATOS VENTA */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Fecha venta</label>
                                            <input
                                                name="fechaVenta"
                                                value={newSale.fecha_venta}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Estado de venta</label>
                                            <select
                                                name="estadoVentaId"
                                                value={newSale.estadoVentaId}
                                                onChange={handleInputChange}
                                                required
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="">Seleccione estado venta</option>
                                                {estadoVentas.map((estado) => (
                                                    <option key={estado.id} value={estado.id}>
                                                        {estado.estado}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de pago</label>
                                            <select
                                                name="metodoPagoId"
                                                onChange={handleInputChange}
                                                value={newSale.metodoPagoId}
                                                required
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" >Seleccione metodo de pago</option>
                                                {metodoPago.map(pago => (
                                                    <option key={pago.id} value={pago.id}>
                                                        {pago.metodo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Descuento (si aplica)</label>
                                            <input
                                                type="number"
                                                name="descuentoVenta"
                                                value={newSale.descuento_venta}
                                                onChange={handleInputChange}
                                                min={0}
                                                max={100}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* DATOS PEDIDO */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Nota (si aplica)</label>
                                            <textarea
                                                name="notaVenta"
                                                placeholder="Nota Venta"
                                                value={newSale.nota_venta}
                                                onChange={handleInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de envío</label>
                                            <select
                                                name="metodoEnvioVentaId"
                                                onChange={handleInputChange}
                                                value={newSale.metodoEnvioVentaId}
                                                required
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value={0}>Seleccione un método de envío</option>
                                                {metodoEnvio.map(envio => (
                                                    <option key={envio.id} value={envio.id}>
                                                        {envio.metodo} - {envio.precio} COP
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Subtotal</label>
                                            <input
                                                type="text"
                                                name="subtotal"
                                                value={subtotal}
                                                disabled
                                                className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <hr className="my-4 border-t-2 border-orange-500" />
                                    <div className="flex items-center">
                                        <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Total</label>
                                        <input
                                            type="text"
                                            name="total"
                                            value={total}
                                            disabled
                                            className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none">
                                        Agregar Venta
                                    </button>
                                    <button
                                        type="button"
                                        className="text-slate-50 bg-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalAgregarVenta;




