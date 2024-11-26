import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan, faFileArrowDown, faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import { format, parse } from 'date-fns';

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

const TablaGenerica = ({ columnas, datos, onEdit, onAdd, onDelete, semaforoStock = false, disableEdit = false, showDownloadButton = false, showEditButton = true, setIsEditModalOpen, setEditingItem, generatePDF, ...props }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleOpenModal = (fila) => {
        setSelectedRow(fila);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRow(null);
    };

    return (
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
                            <th className="px-6 py-3">Ver</th> {/* Nueva columna */}
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
                                <td className="px-6 py-4 text-left">
                                    <button className="!bg-transparent hover:border-orange-500 hover:!bg-orange-500" onClick={() => handleOpenModal(fila)}>
                                        <FontAwesomeIcon icon={faEye} className="dark:text-white text-orange-500 hover:text-white " />
                                    </button>
                                </td>
                                {columnas.map((columna) => (
                                    <td key={columna} className="px-6 py-4">
                                        {typeof fila[columna] === 'object' && fila[columna] !== null
                                            ? JSON.stringify(fila[columna])
                                            : columna === 'fecha_entrada' || columna === 'fecha_venta'
                                                ? format(parse(fila[columna], 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                                                : columna === 'precio_compra' || columna === 'precio_venta' || columna === 'precio' || columna === 'subtotal' || columna === 'total'
                                                    ? `${parseFloat(fila[columna]).toLocaleString('es-CO')} COP`
                                                    : fila[columna]
                                        }
                                    </td>
                                ))}
                                {semaforoStock && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {(() => {
                                                const { color, message } = indicadorStock(fila.stock, fila.nivel_minimo_stock);
                                                return (
                                                    <button
                                                        className={` px-2 py-2 shadow-2xl ${color} text-white font-semibold cursor-default pointer-events-none`}
                                                        disabled
                                                    >
                                                        <span className="text-white">{message}</span>
                                                    </button>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="dark:bg-[#292929] bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                onClick={handleCloseModal}
                            >
                                Cerrar
                                <FontAwesomeIcon icon={faXmark} className="ml-1" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold my-4 text-[#ff6f00]">Detalles</h2>
                        <div className="space-y-2">
                            {Object.keys(selectedRow).map((key) => (
                                <div key={key} className="flex justify-between">
                                    <span className="font-bold text-gray-700 dark:text-slate-100 capitalize">
                                        {key.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {typeof selectedRow[key] === 'object' && selectedRow[key] !== null
                                            ? JSON.stringify(selectedRow[key], null, 2)
                                            : key === 'fecha_entrada' || key === 'fecha_venta'
                                                ? format(new Date(selectedRow[key]), 'dd/MM/yyyy')
                                                : key === 'precio_compra' || key === 'precio_venta' || key === 'precio' || key === 'subtotal' || key === 'total'
                                                    ? `${parseFloat(selectedRow[key]).toLocaleString('es-CO')} COP`
                                                    : selectedRow[key]
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4 space-x-4">
                            {showDownloadButton && (
                                <button
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    onClick={() => generatePDF(selectedRow)}
                                >
                                    Descargar
                                    <FontAwesomeIcon icon={faFileArrowDown} className="ml-1" />
                                </button>
                            )}
                            {showEditButton && (
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => {
                                        setModalOpen(false); // Cierra el modal de visualización
                                        setEditingItem(selectedRow); // Define el registro como el que se va a editar
                                        setIsEditModalOpen(true); // Abre el modal de edición
                                    }}
                                >
                                    Editar
                                    <FontAwesomeIcon icon={faPenToSquare} className="ml-1" />
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    const confirmDelete = window.confirm(
                                        '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'
                                    );
                                    if (confirmDelete) {
                                        onDelete(selectedRow.id); // Llama a la función de eliminación
                                        setModalOpen(false); // Cierra el modal después de la eliminación
                                    }
                                }}
                            >
                                Eliminar
                                <FontAwesomeIcon icon={faTrashCan} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TablaGenerica;








