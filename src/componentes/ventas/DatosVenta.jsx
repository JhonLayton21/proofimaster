const DatosVenta = ({ formData, handleEditInputChange, estadoVentas, metodoPago }) => (
    <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
        <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
        <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Fecha venta</label>
                <input
                    name="fechaVenta"
                    value={formData.fechaVenta}
                    onChange={handleEditInputChange}
                    type="date"
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                />
            </div>
            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Estado de venta</label>
                <select
                    name="estadoVentaId"
                    value={formData.estadoVentaId}
                    onChange={handleEditInputChange}
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                >
                    <option value="" disabled>Seleccione estado venta</option>
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
                    value={formData.metodoPagoId}
                    onChange={handleEditInputChange}
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                >
                    <option value="" disabled>Seleccione método pago</option>
                    {metodoPago.map(metodo => (
                        <option key={metodo.id} value={metodo.id}>
                            {metodo.metodo}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Descuento</label>
                <input
                    name="descuentoVenta"
                    value={formData.descuentoVenta}
                    onChange={handleEditInputChange}
                    type="number"
                    min="0"
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                />
            </div>
        </div>
    </div>
);

export default DatosVenta;
