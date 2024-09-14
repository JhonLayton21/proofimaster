import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DatosCliente = ({ clientes, formData, manejarCambioCliente, clienteSeleccionado }) => (
  <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Cliente</h3>
    <select
      className="w-full p-2 my-4 border rounded-md text-[#757575]"
      name="clienteId"
      value={formData.clienteId}
      onChange={manejarCambioCliente}
    >
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
);

export default DatosCliente;
