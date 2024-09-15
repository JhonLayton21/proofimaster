import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Configuracion = ({ }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 flex items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <FontAwesomeIcon icon={faCog} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4" />
            <div>
                <h2 className="text-lg font-semibold">Configuración cuenta</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ajusta las configuraciones de tu cuenta</p>
            </div>
            <Link to="/configuracion">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default Configuracion;