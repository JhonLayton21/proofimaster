const DatosPedido = ({ formData, handleEditInputChange, metodoEnvio }) => (
    <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
        <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
        <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Nota</label>
                <textarea
                    name="notaVenta"
                    placeholder="Nota Venta"
                    value={formData.notaVenta}
                    onChange={handleEditInputChange}
                    type="text"
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                />
            </div>
            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de envío</label>
                <select
                    name="metodoEnvioVentaId"
                    value={formData.metodoEnvioVentaId}
                    onChange={handleEditInputChange}
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                >
                    <option value="" disabled>Seleccione método envío</option>
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
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleEditInputChange}
                    disabled
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                />
            </div>

            <div className="flex items-center">
                <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Total</label>
                <input
                    name="total"
                    value={formData.total}
                    onChange={handleEditInputChange}
                    disabled
                    className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                />
            </div>

        </div>
    </div>
);

export default DatosPedido;