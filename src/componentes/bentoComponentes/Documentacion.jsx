import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Documentacion = ({ }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-3 row-span-1 flex items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <div className="mx-4 my-4">
                <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4 mb-4" />
                <h2 className="text-lg font-semibold mb-1">Documentación</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consulta todas las funcionalidades de Proofimaster</p>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
        </div>
    );
};

export default Documentacion;