import React, { useState } from 'react';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../../store/api/catalogApi';
import { Loader2, Plus, Search } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';

export const Brands: React.FC = () => {
    const { data: brands, isLoading } = useGetBrandsQuery();
    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrandName.trim()) return;
        try {
            await createBrand({ name: newBrandName }).unwrap();
            setNewBrandName('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create brand:', error);
            alert('Error creating brand');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta marca?')) {
            try {
                await deleteBrand(id).unwrap();
            } catch (error) {
                console.error('Failed to delete brand:', error);
                alert('Error al eliminar marca');
            }
        }
    };

    const filteredBrands = brands?.filter((brand: any) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const columns = [
        { header: 'ID', accessor: 'id' as keyof any }, // Cast to secure type later
        { header: 'Nombre', accessor: 'name' as keyof any },
        {
            header: 'Creado',
            accessor: (brand: any) => new Date(brand.created_at).toLocaleDateString()
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900">Marcas</h1>
                    <p className="text-gray-500 mt-1">Gestiona las marcas de tus perfumes</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Marca
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar marca..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        data={filteredBrands}
                        columns={columns}
                        onDelete={(item) => handleDelete(item.id)}
                    />
                </div>
            </div>

            {/* Create Brand Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 font-serif">Nueva Marca</h2>
                        <form onSubmit={handleCreateBrand}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Marca
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isCreating ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
