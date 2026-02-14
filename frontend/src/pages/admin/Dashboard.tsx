import React from 'react';
import { LayoutDashboard, Tag, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useGetDashboardStatsQuery } from '../../store/api/catalogApi';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-shadow gap-3">
        <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-serif text-gray-500 mb-1 italic">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} bg-opacity-10 shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </div>
    </div>
);

import { ActivityLogTable } from '../../components/admin/ActivityLogTable';

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

            {/* Stats Grid - Mobile optimized with 2 columns */}
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
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

            <div className="grid grid-cols-1 gap-8">


                {/* Activity Log Section */}
                <div className="lg:col-span-2">
                    <ActivityLogTable />
                </div>
            </div>
        </div>
    );
};
