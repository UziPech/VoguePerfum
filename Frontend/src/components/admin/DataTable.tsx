import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onEdit,
    onDelete,
    isLoading
}: DataTableProps<T>) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className="p-4 text-right">Acciones</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            {columns.map((col, idx) => (
                                <td key={idx} className="p-4 text-sm text-gray-700">
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="p-4 text-right space-x-2">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                    No hay registros para mostrar.
                </div>
            )}
        </div>
    );
}
