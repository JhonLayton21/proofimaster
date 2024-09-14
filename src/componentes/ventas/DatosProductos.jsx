const DatosProductos = ({ productos, productosSeleccionados, manejarCambioCheckbox, manejarCambioCantidad }) => (
    <div className="bg-white rounded-lg p-4 dark:bg-[#292929] flex flex-col">
        <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Productos</h3>
        <div className="grid grid-cols-1 gap-4">
            {productos.map((producto) => (
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
);

export default DatosProductos;
