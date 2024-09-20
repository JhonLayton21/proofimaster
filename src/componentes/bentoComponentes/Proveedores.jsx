import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Proveedores = ({ proveedores }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-3 relative rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center alerta-stock">
            <h2 className="text-lg font-bold mb-2">Proveedores</h2>
            {proveedores.length === 0 ? (
                <p className="text-sm text-gray-500">No hay proveedores disponibles</p>
            ) : (
                proveedores.map((proveedor) => (
                    <div key={proveedor.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300 w-full">
                        <div className="relative flex items-center justify-center aspect-square w-10 rounded-full">
                            <FontAwesomeIcon icon={faTruckFast} className="text-slate-800 dark:text-slate-50 fa-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{proveedor.nombreProveedor}</p>
                        </div>
                    </div>
                ))
            )}
            <Link to="/proveedores">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default Proveedores;