import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const DatosVentas = ({ displayedTotalVentas, displayedCantidadVentas }) => {
    return (
        <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <h2 className="text-lg font-bold mb-6">Datos de ventas</h2>
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 border border-gray-400 p-2 rounded-lg mb-2">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign} /> Total generado
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">{displayedTotalVentas} cop</p>
                </div>
                <div className="col-span-2 border border-gray-400 p-2 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingCart} /> Total de ventas
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">{displayedCantidadVentas}</p>
                </div>
            </div>
            <Link to="/ventas">
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default DatosVentas;