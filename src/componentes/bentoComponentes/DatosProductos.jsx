import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const DatosProductos = ({ displayedStockValue, displayedTotal }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <h2 className="text-lg font-bold mb-6">Datos de productos</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="col-span-2 border border-gray-400 p-2 rounded-lg mb-4">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign} /> Valor stock
                    </h3>
                    <p className="text-4xl lg:text-2xl font-bold text-orange-500 text-right">
                        {displayedStockValue}cop
                    </p>
                </div>
                <div className="col-span-2 border border-gray-400 p-2 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingCart} /> Total de productos
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">
                        {displayedTotal}
                    </p>
                </div>
            </div>
            <Link to="/productos">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default DatosProductos;