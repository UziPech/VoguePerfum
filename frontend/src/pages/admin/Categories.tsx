import React from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/catalogApi';
import { useAppSelector } from '../../store/hooks';

export const Categories: React.FC = () => {
    const { data: categories = [], isLoading } = useGetCategoriesQuery(undefined);
    const { user } = useAppSelector((state) => state.auth);

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

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory({ id: editingId, name: newCategoryName }).unwrap();
            } else {
                await createCategory({ name: newCategoryName }).unwrap();
            }
            setIsModalOpen(false);
            setNewCategoryName('');
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Error al guardar la categoría');
        }
    };

    const handleEdit = (category: any) => {
        setNewCategoryName(category.name);
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
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>

                {user?.role === 'admin' && (
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setNewCategoryName('');
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Categoría
                    </button>
                )}
            </div>

            <DataTable
                data={categories}
                columns={columns}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={(item) => handleDelete(item.id)}
            />

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
