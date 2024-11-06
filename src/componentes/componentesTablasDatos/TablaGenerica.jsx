import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { format } from 'date-fns';

const indicadorStock = (stock, nivel_minimo_stock) => {
    console.log(`Stock: ${stock}, Nivel mínimo de stock: ${nivel_minimo_stock}`);

    if (stock >= nivel_minimo_stock * 2) {
        return { color: 'border-2 border-green-500 bg-green-700', message: 'Stock Alto' };
    }
    if (stock > nivel_minimo_stock) {
        return { color: 'border-2 border-yellow-500 bg-yellow-700', message: 'Stock Medio' };
    }
    return { color: 'border-2 border-red-500 bg-red-700', message: 'Stock Bajo' };
};


const TablaGenerica = ({ columnas, datos, onAdd, onEdit, onDelete, generatePDF, onAlert, disableEdit = false, showDownloadButton = false, semaforoStock = false }) => (
    <div>
        <div className="flex justify-end m-2">
            <button
                className="text-white font-bold bg-green-600 hover:bg-green-800 cursor-pointer px-4 py-2 rounded-lg"
                onClick={onAdd}
            >
                <FontAwesomeIcon icon={faPlus} className="fa-xl mr-3" />
                Agregar
            </button>
        </div>
        <div className="relative overflow-x-auto rounded-2xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        {columnas.map((columna) => (
                            <th key={columna} className="px-6 py-3">
                                {columna}
                            </th>
                        ))}
                        {semaforoStock && <th className="px-6 py-3">ESTADO STOCK</th>}
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                            {columnas.map((columna) => (
                                <td key={columna} className="px-6 py-4">
                                    {typeof fila[columna] === 'object' && fila[columna] !== null
                                        ? JSON.stringify(fila[columna]) // Convierte el objeto a string
                                        : columna === 'fecha_entrada' || columna === 'fecha_venta'
                                            ? format(new Date(fila[columna]), 'dd/MM/yyyy') // Formatea las fechas
                                            : columna === 'precio_compra' || columna === 'precio_venta' || columna === 'precio' || columna === 'subtotal' || columna === 'total'
                                                ? `${parseFloat(fila[columna]).toLocaleString('es-CO')} COP` // Formatea precios
                                                : fila[columna] // Renderiza el valor normal si no es un objeto
                                    }
                                </td>
                            ))}
                            {semaforoStock && (
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {(() => {
                                            const { color, message } = indicadorStock(fila.stock, fila.nivel_minimo_stock);
                                            return (
                                                <>
                                                    <button
                                                        className={` px-2 py-2 shadow-2xl ${color} text-white font-semibold cursor-default pointer-events-none`}
                                                        disabled
                                                    >
                                                        <span className="text-white">{message}</span>
                                                    </button>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </td>
                            )}

                            <td className="px-6 py-4 text-right">
                                {showDownloadButton && (
                                    <button
                                        className="text-yellow-600 dark:bg-[#242424] m-1 hover:underline"
                                        onClick={() => generatePDF(fila)}
                                    >
                                        Descargar
                                        <FontAwesomeIcon icon={faFileArrowDown} className="ml-1" />
                                    </button>
                                )}
                                {!disableEdit && (
                                    <button
                                        className="text-blue-600 dark:bg-[#242424] m-1 hover:underline"
                                        onClick={() => onEdit(fila)}
                                    >
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className="ml-1" />
                                    </button>
                                )}
                                <button
                                    className="text-red-600 dark:bg-[#242424] hover:underline m-1"
                                    onClick={() => {
                                        if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
                                            onDelete(fila.id);
                                            onAlert('Elemento eliminado exitosamente', 'delete');
                                        }
                                    }}
                                >
                                    Eliminar
                                    <FontAwesomeIcon icon={faTrashCan} className="ml-1" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TablaGenerica;







