import React, { useState } from 'react';
import { useGetActivityLogsQuery } from '../../store/api/catalogApi';
import { Loader2, ChevronLeft, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { ActivityLog } from '../../../types';

export const ActivityLogTable: React.FC = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const { data, isLoading } = useGetActivityLogsQuery({ page, limit });

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const logs: ActivityLog[] = data?.data || [];
    const meta = data?.meta || { page: 1, pages: 1 };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900">Actividad Reciente</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-medium">
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Acción</th>
                            <th className="px-6 py-3">Entidad</th>
                            <th className="px-6 py-3">Detalle</th>
                            <th className="px-6 py-3">Justificación</th>
                            <th className="px-6 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                    No hay actividad registrada.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {log.user_name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {log.entity}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {log.entity_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate" title={log.justification}>
                                        {log.justification || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Página {meta.page} de {meta.pages}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                        disabled={page === meta.pages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};
