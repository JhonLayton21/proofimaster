import React, { useState, useEffect } from "react";

const ModalEditarProducto = ({ isOpen, onClose, refreshProductos, editingProduct, onSuccess }) => {
    const [marcaProducto, setMarcaProducto] = useState([]);
    const [referenciaProducto, setReferenciaProducto] = useState([]);
    const [proveedorProducto, setProveedorProducto] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Fetch para obtener referencias, marcas, proveedores del producto
        const fetchReferenciasProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/referencias_productos');
                const data = await response.json();
                setReferenciaProducto(data);
            } catch (error) {
                console.error('Error al obtener las referencias del productos:', error);
            }
        };

        const fetchMarcasProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/marcas_productos');
                const data = await response.json();
                setMarcaProducto(data);
            } catch (error) {
                console.error('Error al obtener las marcas del productos:', error);
            }
        };

        const fetchProveedorProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/proveedores');
                const data = await response.json();
                setProveedorProducto(data);
            } catch (error) {
                console.error('Error al obtener el proveedor del producto:', error);
            }
        };

        fetchReferenciasProducto();
        fetchMarcasProducto();
        fetchProveedorProducto();
    }, []);

    useEffect(() => {
        if (isOpen && editingProduct) {
            // Establecer los datos del producto en el estado del formulario
            setFormData({
                nombreProducto: editingProduct.nombre || "",
                descripcionProducto: editingProduct.descripcion || "",
                fechaEntradaProducto: editingProduct.fecha_entrada || "",
                marcaProductoId: editingProduct.marca_id || "",
                nivelMinimoStock: editingProduct.nivel_minimo_stock || "",
                precioCompraProducto: editingProduct.precio_compra || "",
                precioVentaProducto: editingProduct.precio_venta || "",
                proveedorProductoId: editingProduct.proveedor_id || "",
                referenciaProductoId: editingProduct.referencia_id || "",
                Stock: editingProduct.stock || "",
            });
        }
    }, [isOpen, editingProduct]);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombreProducto,
            descripcionProducto,
            fechaEntradaProducto,
            marcaProductoId,
            nivelMinimoStock,
            precioCompraProducto,
            precioVentaProducto,
            proveedorId,
            referenciaProductoId,
            Stock } = formData;

        try {
            const response = await fetch(`http://localhost:5000/productos/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombreProducto,
                    descripcion: descripcionProducto,
                    fecha_entrada: fechaEntradaProducto,
                    marca_id: marcaProductoId,
                    nivel_minimo_stock: nivelMinimoStock,
                    precio_compra: precioCompraProducto,
                    precio_venta: precioVentaProducto,
                    proveedor_id: proveedorId,
                    referencia_id: referenciaProductoId,
                    stock: Stock,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto actualizado:", data);
                refreshProductos();
                onClose();
                onSuccess();
            } else {
                console.error("Error al actualizar el producto");
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Producto
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
                        <div className="relative p-6 flex-auto dark:bg-[#242424]">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombreProducto"
                                        placeholder="Nombre Producto"
                                        value={formData.nombreProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <textarea
                                        name="descripcionProducto"
                                        placeholder="Descripción Producto"
                                        value={formData.descripcionProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="referenciaProducto"
                                        value={formData.referenciaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="" disabled>Seleccione Referencia</option>
                                        {referenciaProducto.map((referencia) => (  
                                            <option key={referencia.id} value={referencia.id}>
                                                {referencia.codigo}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="marcaProducto"
                                        value={formData.marcaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="" disabled>Seleccionar Marca</option>
                                        {marcaProducto.map((marca) => (
                                            <option key={marca.id} value={marca.id}>
                                                {marca.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="precioCompraProducto"
                                        placeholder="Precio Compra"
                                        value={formData.precioCompraProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="precioVentaProducto"
                                        placeholder="Precio Venta"
                                        value={formData.precioVentaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="Stock"
                                        placeholder="Stock"
                                        value={formData.Stock}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="nivelMinimoStock"
                                        placeholder="Nivel Mínimo Stock"
                                        value={formData.nivelMinimoStock}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="proveedorId"
                                        value={formData.proveedorId}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="" disabled>Seleccione Proveedor</option>
                                        {proveedorProducto.map((proveedor) => (
                                            <option key={proveedor.id} value={proveedor.id}>
                                                {proveedor.nombre_proveedor}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        name="fechaEntradaProducto"
                                        value={formData.fechaEntradaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                </div>
                                <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    className="text-slate-50 bg-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalEditarProducto;


