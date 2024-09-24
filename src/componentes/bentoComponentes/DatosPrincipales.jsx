import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const DatosPrincipales = ({ displayedTotalVentas, displayedCantidadVentas, displayedStockValue, displayedTotal }) => {
    return (
        <div className="bentoItem shadow-lg col-span-12 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <h2 className="text-lg font-bold mb-6">Resumen de Inventario y Ventas</h2>

            {/* Grid que contiene ambos componentes fusionados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Valor Stock */}
                <div className="border border-gray-400 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign} /> Valor stock
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">
                        {displayedStockValue} cop
                    </p>
                </div>

                {/* Total de Productos */}
                <div className="border border-gray-400 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingCart} /> Total de productos
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">
                        {displayedTotal}
                    </p>
                </div>

                {/* Total Generado */}
                <div className="border border-gray-400 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign} /> Total generado
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">
                        {displayedTotalVentas} cop
                    </p>
                </div>

                {/* Total de Ventas */}
                <div className="border border-gray-400 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingCart} /> Total de ventas
                    </h3>
                    <p className="text-4xl font-bold text-orange-500 text-right">
                        {displayedCantidadVentas}
                    </p>
                </div>

            </div>

            {/* Links de navegación */}
            <div className="flex justify-between mt-4">
                <Link to="/productos" className="text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500">
                    <FontAwesomeIcon icon={faArrowRight} /> Ir a productos
                </Link>
                <Link to="/ventas" className="text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500">
                    <FontAwesomeIcon icon={faArrowRight} /> Ir a ventas
                </Link>
            </div>
        </div>

    );
};

export default DatosPrincipales;