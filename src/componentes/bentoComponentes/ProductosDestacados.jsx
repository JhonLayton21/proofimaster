import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductosDestacados = ({ productosPrincipales }) => {
    return (
        <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <div className="flex flex-col h-full">
                {/* Div superior */}
                <div className="bg-[#ff6f00] text-white p-4 flex items-center justify-center rounded-lg h-1/2">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faStar} className="ml-4 fa-2x" />
                        <h2 className="mx-4 md:text-4xl text-xl font-bold">Productos destacados</h2>
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
                                    {producto.nombreProducto}
                                </li>
                            ))
                        )}
                    </ol>
                </div>
            </div>
            <Link to="/productos">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default ProductosDestacados;