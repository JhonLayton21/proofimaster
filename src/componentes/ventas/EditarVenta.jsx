import React, { useState, useEffect } from 'react';

const EditarVenta = ({ ventaId, onClose }) => {
    const [venta, setVenta] = useState(null);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // Fetch data for editing
    useEffect(() => {
        const fetchData = async () => {

            if (!ventaId) {
                console.error('El ID de la venta no está definido');
                return;
            }
            
            try {
                const responseVenta = await fetch(`http://localhost:5000/ventas/${ventaId}`);
                const ventaData = await responseVenta.json();
                setVenta(ventaData);

                const responseProductos = await fetch("http://localhost:5000/productos");
                const productosData = await responseProductos.json();
                setProductos(productosData);

                const responseClientes = await fetch("http://localhost:5000/clientes");
                const clientesData = await responseClientes.json();
                setClientes(clientesData);

                const responseEstadoVentas = await fetch("http://localhost:5000/estado_venta");
                const estadoVentasData = await responseEstadoVentas.json();
                setEstadoVentas(estadoVentasData);

                const responseMetodoPago = await fetch("http://localhost:5000/metodo_pago");
                const metodoPagoData = await responseMetodoPago.json();
                setMetodoPago(metodoPagoData);

                const responseMetodoEnvio = await fetch("http://localhost:5000/metodo_envio_venta");
                const metodoEnvioData = await responseMetodoEnvio.json();
                setMetodoEnvio(metodoEnvioData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, [ventaId]);

    useEffect(() => {
        if (venta) {
            // Populate the selected products and calculate subtotal and total
            const productosSeleccionados = {}; // Initialize with existing products from `venta`
            venta.productos.forEach(producto => {
                productosSeleccionados[producto.producto_id] = {
                    cantidad: producto.cantidad,
                    precio: producto.precio
                };
            });
            setProductosSeleccionados(productosSeleccionados);

            const calcularSubtotal = () => {
                const subtotalProductos = Object.values(productosSeleccionados).reduce(
                    (acc, producto) => acc + producto.cantidad * producto.precio, 0
                );
                const metodoEnvioSeleccionado = metodoEnvio.find(envio => envio.id === venta.metodo_envio_venta_id);
                const precioEnvio = metodoEnvioSeleccionado ? metodoEnvioSeleccionado.precio * 1000 : 0;
                return parseFloat(subtotalProductos) + parseFloat(precioEnvio);
            };

            const calcularTotal = (subtotal, descuentoVenta) => {
                const descuento = ((descuentoVenta || 0) / 100) * subtotal;
                return subtotal - descuento;
            };

            const nuevoSubtotal = calcularSubtotal();
            setSubtotal(nuevoSubtotal);
            const nuevoTotal = calcularTotal(nuevoSubtotal, venta.descuento_venta);
            setTotal(nuevoTotal);
        }
    }, [venta, metodoEnvio, productosSeleccionados]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVenta(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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
        setVenta(prevState => ({
            ...prevState,
            cliente_id: clienteId
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!venta) {
            console.error("Venta no está disponible");
            return;
        }

        const productosFiltrados = Object.entries(productosSeleccionados)
            .filter(([id, detalles]) => detalles)
            .map(([id, detalles]) => ({
                producto_id: id,
                cantidad: detalles.cantidad,
                precio: detalles.precio
            }));

        try {
            const response = await fetch(`http://localhost:5000/ventas/${ventaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    precio_venta: venta.precio_venta,
                    cliente_id: venta.cliente_id,
                    fecha_venta: venta.fecha_venta,
                    estado_venta_id: venta.estado_venta_id,
                    metodo_pago_id: venta.metodo_pago_id,
                    descuento_venta: venta.descuento_venta,
                    nota_venta: venta.nota_venta,
                    metodo_envio_venta_id: venta.metodo_envio_venta_id,
                    subtotal: subtotal,
                    total: total,
                    productos: productosFiltrados
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la venta");
            }

            const data = await response.json();
            console.log("Venta actualizada:", data);

            onClose();
            
        } catch (err) {
            console.error("Error en la solicitud:", err);
        }
    };

    if (!venta) {
        return <div>Cargando...</div>; // Show loading state
    }

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424] bg-[#eeeeee]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Venta
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
                            <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
    
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
                                                <label htmlFor={producto.id} className="text-[#757575]">
                                                    {producto.nombre} - {producto.precio_venta} COP
                                                </label>
                                                {productosSeleccionados[producto.id] && (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={productosSeleccionados[producto.id].cantidad}
                                                        onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                                                        className="ml-4 p-2 border rounded-md text-[#757575]"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
    
                                {/* DATOS CLIENTE */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Cliente</h3>
                                    <select
                                        name="cliente_id"
                                        value={venta.cliente_id}
                                        onChange={manejarCambioCliente}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    >
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
    
                                {/* DATOS VENTA */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <input
                                        name="fechaVenta"
                                        value={venta.fecha_venta}
                                        onChange={handleInputChange}
                                        type="date"
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    />
                                    <select
                                        name="estadoVentaId"
                                        value={venta.estado_venta_id}
                                        onChange={handleInputChange}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    >
                                        <option value="">Seleccione un estado</option>
                                        {estadoVentas.map(estado => (
                                            <option key={estado.id} value={estado.id}>
                                                {estado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="metodoPagoId"
                                        onChange={handleInputChange}
                                        value={venta.metodo_pago_id}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    >
                                        <option value="">Seleccione un método de pago</option>
                                        {metodoPago.map(metodo => (
                                            <option key={metodo.id} value={metodo.id}>
                                                {metodo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="descuentoVenta"
                                        value={venta.descuento_venta}
                                        onChange={handleInputChange}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    />
                                    <textarea
                                        name="notaVenta"
                                        placeholder="Nota Venta"
                                        value={venta.nota_venta}
                                        onChange={handleInputChange}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    />
                                    <select
                                        name="metodoEnvioVentaId"
                                        onChange={handleInputChange}
                                        value={venta.metodo_envio_venta_id}
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]"
                                    >
                                        <option value="">Seleccione un método de envío</option>
                                        {metodoEnvio.map(envio => (
                                            <option key={envio.id} value={envio.id}>
                                                {envio.metodo} - {parseFloat(envio.precio).toFixed(0)} COP
                                            </option>
                                        ))}
                                    </select>
                                </div>
    
                                <div className="flex justify-between p-4 bg-[#f5f5f5] rounded-lg">
                                    <div>
                                        <p>Subtotal: {subtotal.toFixed(0)} COP</p>
                                        <p>Total: {total.toFixed(0)} COP</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Actualizar Venta
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditarVenta;


