import React, { useState, useMemo } from 'react';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../../store/api/catalogApi';
import { Loader2, Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';
import { fuzzyMatchAny } from '../../utils/fuzzyMatch';

export const Brands: React.FC = () => {
    const { data: brands, isLoading, refetch } = useGetBrandsQuery();
    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [newBrandName, setNewBrandName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteBrand(deleteConfirmId).unwrap();
            setDeleteConfirmId(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete brand:', error);
            alert('Error al eliminar marca');
            setDeleteConfirmId(null);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id);
    };

    // Búsqueda inteligente con fuzzyMatch
    const allBrands = brands || [];
    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return allBrands;
        return allBrands.filter((brand: any) =>
            fuzzyMatchAny(searchQuery, [brand.name])
        );
    }, [searchQuery, allBrands]);

    // Paginación client-side
    const totalFiltered = filteredBrands.length;
    const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
    const paginatedBrands = filteredBrands.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const columns = [
        { header: 'ID', accessor: 'id' as keyof any },
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
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar marca..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <span className="text-sm text-gray-400 self-center">
                        {searchQuery.trim()
                            ? `${totalFiltered} resultado${totalFiltered !== 1 ? 's' : ''} de ${allBrands.length}`
                            : `${allBrands.length} marcas en total`
                        }
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        data={paginatedBrands}
                        columns={columns}
                        onDelete={(item) => handleDelete(item.id)}
                    />
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Página {currentPage} de {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="text-sm text-gray-600 self-center px-2">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
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

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h2>
                            <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar esta marca? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Eliminando...
                                    </>
                                ) : (
                                    'Eliminar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
