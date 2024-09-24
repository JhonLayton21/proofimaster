import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faWarning } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AlertasStock = ({ productosConAlertas }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-6 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos" className="w-full h-full flex flex-col items-center">
                {/* Contenedor flexible para los dos divs */}
                <div className="flex flex-col h-full w-full">
                    {/* Div superior */}
                    <div className="bg-red-600 text-white p-4 flex items-center justify-center rounded-lg h-1/2">
                        <div className="flex flex-col sm:flex-row items-center">
                            <FontAwesomeIcon icon={faWarning} className="mb-2 sm:mb-0 mr-2 fa-3x" />
                            <h2 className="text-center sm:text-left mx-4 md:text-4xl text-xl font-bold">Alertas de stock</h2>
                        </div>
                    </div>

                    {/* Div inferior */}
                    <div className="p-2 h-1/2 overflow-auto">
                        <ul className="list-disc list-inside">
                            {productosConAlertas.length === 0 ? (
                                <li>No hay alertas de stock</li>
                            ) : (
                                productosConAlertas.map((producto) => (
                                    <li key={producto.id} className="text-red-500">
                                        {producto.nombre} (Stock: {producto.stock}, Mínimo: {producto.nivel_minimo_stock})
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>

    );
};

export default AlertasStock;