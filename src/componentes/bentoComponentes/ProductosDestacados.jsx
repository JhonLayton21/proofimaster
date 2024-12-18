import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductosDestacados = ({ productosPrincipales }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-6 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos" className="w-full h-full flex flex-col items-center">
            <div className="flex flex-col h-full w-full">
                {/* Div superior */}
                <div className="bg-[#ff6f00] text-white p-4 flex items-center justify-center rounded-lg h-1/2">
                    <div className="flex flex-col sm:flex-row items-center">
                        <FontAwesomeIcon icon={faStar} className="mb-2 sm:mb-0 fa-2x" />
                        <h2 className="text-center sm:text-left mx-4 md:text-4xl text-xl font-bold">Productos recientes</h2>
                    </div>
                </div>

                {/* Div inferior */}
                <div className="p-2 h-1/2 overflow-auto">
                    <ol className="list-decimal list-inside mb-4">
                        {productosPrincipales.length === 0 ? (
                            <li>No hay productos recientes</li>
                        ) : (
                            productosPrincipales.map((producto) => (
                                <li key={producto.id} className="py-3">
                                    {producto.nombre} - {producto.fecha_entrada}
                                </li>
                            ))
                        )}
                    </ol>
                </div>
            </div>
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>

    );
};

export default ProductosDestacados;