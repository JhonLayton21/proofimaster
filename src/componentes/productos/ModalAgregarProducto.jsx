import React, { useEffect, useState } from 'react';

const ModalAgregarProducto = ({ isOpen, onClose, refreshProductos, onSuccess }) => {
    const [newProduct, setNewProduct] = useState({
        nombreProducto: "",
        descripcionProducto: "",
        fechaEntradaProducto: "",
        marcaProductoId: "",
        nivelMinimoStock: "",
        precioCompraProducto: "",
        precioVentaProducto: "",
        proveedorId: "",
        referenciaProductoId: "",
        Stock: ""
    });

    const [marcaProducto, setMarcaProducto] = useState([]);
    const [referenciaProducto, setReferenciaProducto] = useState([]);
    const [proveedorProducto, setProveedorProducto] = useState([]);

    useEffect(() => {
        // Fetch para obtener marcas del producto
        const fetchMarcasProducto = async () => {
            try {
                const response = await fetch("http://localhost:5000/marcas_productos");

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await response.json();
                setMarcaProducto(data);
            } catch (error) {
                console.error("Error al obtener las marcas del producto", error);
            }
        };

        fetchMarcasProducto();
    }, []);

    useEffect(() => {
        // Fetch para obtener referencias del producto
        const fetchReferenciasProducto = async () => {
            try {
                const response = await fetch("http://localhost:5000/referencias_productos");

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await response.json();
                setReferenciaProducto(data);
            } catch (error) {
                console.error("Error al obtener las referencias del producto", error);
            }
        };

        fetchReferenciasProducto();
    }, []);

    useEffect(() => {
        // Fetch para obtener proveedores del producto
        const fetchProveedorProducto = async () => {
            try {
                const response = await fetch("http://localhost:5000/proveedores");

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await response.json();
                setProveedorProducto(data);
            } catch (error) {
                console.error("Error al obtener el proveedor del producto", error);
            }
        };

        fetchProveedorProducto();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
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
            Stock
        } = newProduct;

        try {
            const response = await fetch("http://localhost:5000/productos", {
                method: "POST",
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
                console.log("Producto agregado:", data);
                refreshProductos();
                onClose();
                setNewProduct({
                    nombreProducto: "",
                    descripcionProducto: "",
                    fechaEntradaProducto: "",
                    marcaProductoId: "",
                    nivelMinimoStock: "",
                    precioCompraProducto: "",
                    precioVentaProducto: "",
                    proveedorId: "",
                    referenciaProductoId: "",
                    Stock: ""
                });
                onSuccess();
            } else {
                console.error("Error al agregar el producto:", await response.text());
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);

        }
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-full sm:max-w-lg">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Agregar Producto
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
                        {/*body*/}
                        <div className="relative p-6 flex-auto dark:bg-[#242424]">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombreProducto"
                                        placeholder="Nombre Producto"
                                        value={newProduct.nombreProducto}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <textarea
                                        name="descripcionProducto"
                                        placeholder="Descripción Producto"
                                        value={newProduct.descripcionProducto}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="referenciaProductoId"
                                        value={newProduct.referenciaProductoId}
                                        onChange={handleInputChange}
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
                                        name="marcaProductoId"
                                        value={newProduct.marcaProductoId}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="">Seleccionar Marca</option>
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
                                        value={newProduct.precioCompraProducto}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="precioVentaProducto"
                                        placeholder="Precio Venta"
                                        value={newProduct.precioVentaProducto}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="Stock"
                                        min={0}
                                        placeholder="Stock"
                                        value={newProduct.Stock}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="nivelMinimoStock"
                                        min={0}
                                        placeholder="Nivel Mínimo Stock"
                                        value={newProduct.nivelMinimoStock}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="proveedorId"
                                        value={newProduct.proveedorId}
                                        onChange={handleInputChange}
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
                                        value={newProduct.fechaEntradaProducto}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                </div>
                                <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                    Agregar Producto
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
                        {/*footer*/}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

        </>
    );
};

export default ModalAgregarProducto;




