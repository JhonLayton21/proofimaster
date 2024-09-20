import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Clientes = ({ clientes }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-3 relative rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center min-h-[400px] alerta-stock">
            <h2 className="text-lg font-bold mb-2">Clientes</h2>
            {clientes.length === 0 ? (
                <p className="text-sm text-gray-500">No hay clientes disponibles</p>
            ) : (
                clientes.map((cliente) => (
                    <div key={cliente.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300 w-full">
                        <div className="relative aspect-square w-10 rounded-full">
                            <FontAwesomeIcon icon={faAddressBook} className="text-slate-800 dark:text-slate-50 fa-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{cliente.nombreCliente}</p>
                        </div>
                    </div>
                ))
            )}
            <Link to="/clientes">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default Clientes;