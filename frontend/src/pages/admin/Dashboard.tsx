import React from 'react';
import { LayoutDashboard, Tag, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useGetDashboardStatsQuery } from '../../store/api/catalogApi';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-serif text-gray-500 mb-1 italic">{title}</p>
            <h3 className="text-3xl font-serif font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            {/* Note: In vintage theme, we use muted icon colors */}
            <Icon className={`w-6 h-6 text-gray-800`} />
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { data: stats, isLoading } = useGetDashboardStatsQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Default to 0 if data is missing
    const { totalProducts = 0, activeCategories = 0, totalBrands = 0, totalStock = 0, totalSales = 0 } = stats || {};

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2 font-serif italic">Bienvenido al panel de administración de Vogue Perfum.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Productos"
                    value={totalProducts}
                    icon={Package}
                    color="bg-gray-200"
                />
                <StatCard
                    title="Categorías Activas"
                    value={activeCategories}
                    icon={Tag}
                    color="bg-gray-200"
                />
                <StatCard
                    title="Marcas Registradas"
                    value={totalBrands}
                    icon={Tag}
                    color="bg-gray-200"
                />
                <StatCard
                    title="Stock Total"
                    value={totalStock}
                    icon={LayoutDashboard}
                    color="bg-gray-200"
                />
            </div>

            {/* Sales Section (Placeholder for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900">Ventas del Mes</h2>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-serif font-bold text-gray-900">${totalSales.toLocaleString()}</span>
                        <span className="text-gray-400 mb-2 italic">MXN</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">Actividad Reciente</h2>
                    <p className="text-gray-400 italic">No hay actividad reciente para mostrar.</p>
                </div>
            </div>
        </div>
    );
};
