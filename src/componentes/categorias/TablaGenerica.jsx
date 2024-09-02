import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { format } from 'date-fns';

const TablaGenerica = ({ columnas, datos, onAdd, onEdit, onDelete, onAlert }) => (
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
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                            {columnas.map((columna) => (
                                <td key={columna} className="px-6 py-4">
                                    {columna === 'fecha_entrada'
                                        ? format(new Date(fila[columna]), 'dd/MM/yyyy')
                                        : columna === 'precio_compra' || columna === 'precio_venta'
                                            ? `${parseFloat(fila[columna]).toLocaleString('es-CO')} COP`
                                            : fila[columna]}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <button
                                    className="text-blue-600 hover:underline m-1"
                                    onClick={() => onEdit(fila)}
                                >
                                    Editar
                                    <FontAwesomeIcon icon={faPenToSquare} className="ml-1" />
                                </button>
                                <button
                                    className="text-red-600 hover:underline m-1"
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




