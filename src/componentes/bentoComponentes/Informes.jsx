import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Informes = ({ }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-6 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <h2 className="text-lg font-bold">Informes generados</h2>
            <div className="flex justify-center items-center h-full pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Documentos visibles por defecto */}
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 1</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 2</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 3</span>
                    </div>
                    {/* Documentos adicionales ocultos por defecto */}
                    <div className="hidden sm:flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 4</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 5</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-center">
                        <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                        <span>Documento 6</span>
                    </div>
                </div>
            </div>
            <Link to="/informes">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default Informes;