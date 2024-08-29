import React from "react";


const TablaGenerica = ({ columnas, datos }) => {
    return (
        <div className="relative overflow-x-auto rounded-2xl pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        {columnas.map((columna) => (
                            <th key={columna} className="px-6 py-3">
                                {columna}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                            {columnas.map((columna) => (
                                <td key={columna} className="px-6 py-4">
                                    {fila[columna]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TablaGenerica;