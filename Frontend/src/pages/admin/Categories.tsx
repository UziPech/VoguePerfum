import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/catalogApi';
import { useAppSelector } from '../../store/hooks';
import { fuzzyMatchAny } from '../../utils/fuzzyMatch';

export const Categories: React.FC = () => {
    const { data: categories = [], isLoading } = useGetCategoriesQuery(undefined);
    const { user } = useAppSelector((state) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Búsqueda inteligente con fuzzyMatch
    const allCategories = Array.isArray(categories) ? categories : [];
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return allCategories;
        return allCategories.filter((cat: any) =>
            fuzzyMatchAny(searchQuery, [cat.name, cat.slug])
        );
    }, [searchQuery, allCategories]);

    // Paginación client-side
    const totalFiltered = filteredCategories.length;
    const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const columns = [
        { header: 'Nombre', accessor: 'name' as const },
        { header: 'Slug', accessor: 'slug' as const },
        {
            header: 'Estado',
            accessor: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.is_active ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [justification, setJustification] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                if (!justification.trim()) {
                    alert('La justificación es obligatoria para editar.');
                    return;
                }
                await updateCategory({ id: editingId, name: newCategoryName, justification }).unwrap();
            } else {
                await createCategory({ name: newCategoryName }).unwrap();
            }
            setIsModalOpen(false);
            setNewCategoryName('');
            setJustification('');
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Error al guardar la categoría');
        }
    };

    const handleEdit = (category: any) => {
        setNewCategoryName(category.name);
        setJustification('');
        setEditingId(category.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await deleteCategory(id).unwrap();
            } catch (error) {
                console.error('Failed to delete category:', error);
                alert('Error al eliminar categoría');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewCategoryName('');
        setJustification('');
        setEditingId(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900">Categorías</h1>
                    <p className="text-gray-500 mt-1">Gestiona las categorías de tus perfumes</p>
                </div>

                {user?.role === 'admin' && (
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setNewCategoryName('');
                            setJustification('');
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Categoría
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
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
                            ? `${totalFiltered} resultado${totalFiltered !== 1 ? 's' : ''} de ${allCategories.length}`
                            : `${allCategories.length} categorías en total`
                        }
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        data={paginatedCategories}
                        columns={columns}
                        onEdit={handleEdit}
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

            {/* Create/Edit Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 font-serif">
                            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Categoría
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                            </div>
                            {editingId && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Justificación del Cambio <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-20 bg-yellow-50"
                                        placeholder="¿Por qué estás editando esto?"
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isCreating || isUpdating ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
