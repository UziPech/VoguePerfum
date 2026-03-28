import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';
import { useGetProductsQuery, useGetBrandsQuery, useGetCategoriesQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../store/api/catalogApi';
import { useAppSelector } from '../../store/hooks';

export const Products: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const ITEMS_PER_PAGE = 10;

    // Debounce: espera 400ms después de que el usuario deja de escribir
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(inputValue);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data, isLoading, isFetching } = useGetProductsQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery || undefined
    });
    const { data: brands } = useGetBrandsQuery();
    const { data: categories } = useGetCategoriesQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const { user } = useAppSelector((state) => state.auth);
    const products = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, pages: 1 };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        image_url: '',
        justification: ''
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await deleteProduct(id).unwrap();
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Error al eliminar producto');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cleanStock = formData.stock === '' ? 0 : parseInt(formData.stock);

            if (cleanStock < 0) {
                alert('El stock no puede ser negativo.');
                return;
            }

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: cleanStock
            };

            if (editingId) {
                if (!formData.justification.trim()) {
                    alert('Por favor, ingresa una justificación para el cambio.');
                    return;
                }
                await updateProduct({ id: editingId, ...productData }).unwrap();
            } else {
                await createProduct(productData).unwrap();
            }

            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Error al guardar producto');
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            category_id: product.category_id || '',
            brand_id: product.brand_id || '',
            image_url: product.image_url || '',
            justification: ''
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', stock: '', category_id: '', brand_id: '', image_url: '', justification: '' });
        setEditingId(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const columns = [
        {
            header: 'Imagen',
            accessor: (item: any) => (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                    )}
                </div>
            )
        },
        { header: 'Nombre', accessor: 'name' as const },
        {
            header: 'Marca',
            accessor: (item: any) => item.brands?.name || 'N/A'
        },
        {
            header: 'Categoría',
            accessor: (item: any) => item.categories?.name || 'N/A'
        },
        {
            header: 'Precio',
            accessor: (item: any) => `$${item.price.toFixed(2)}`
        },
        {
            header: 'Stock',
            accessor: (item: any) => (
                <span className={`font-medium ${item.stock < 5 ? 'text-red-600' : 'text-gray-800'}`}>
                    {item.stock}
                </span>
            )
        },
    ];

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
                    <h1 className="text-3xl font-serif text-gray-900">Productos</h1>
                    <p className="text-gray-500 mt-1">Gestiona tu catálogo de perfumes</p>
                </div>

                {user?.role === 'admin' && (
                    <button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors min-h-[44px]"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Nuevo Producto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                            w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar producto o marca..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 
                                rounded-lg focus:outline-none focus:ring-2 
                                focus:ring-black text-sm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <span className="text-sm text-gray-400 self-center">
                        {meta.total} productos en total
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        data={products}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={(item) => handleDelete(item.id)}
                    />
                </div>

                {meta.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 
                        flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Página {meta.page} de {meta.pages} 
                            — {meta.total} productos
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isFetching}
                                className="p-1 rounded hover:bg-gray-100 
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="text-sm text-gray-600 self-center px-2">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(meta.pages, p + 1))}
                                disabled={currentPage === meta.pages || isFetching}
                                className="p-1 rounded hover:bg-gray-100 
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-serif font-bold mb-6">
                            {editingId ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.brand_id}
                                        onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Marca</option>
                                        {brands?.map((brand: any) => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar Categoría</option>
                                        {categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock (Opcional)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        onKeyDown={(e) => {
                                            if (['-', 'e', 'E', '+'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Imagen del Producto
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        alert('El archivo es demasiado grande. Máximo 5MB.');
                                                        return;
                                                    }
                                                    try {
                                                        const { supabase } = await import('../../lib/supabase');
                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${Math.random()}.${fileExt}`;
                                                        const filePath = `${fileName}`;

                                                        const { error: uploadError } = await supabase.storage
                                                            .from('products')
                                                            .upload(filePath, file);

                                                        if (uploadError) throw uploadError;

                                                        const { data } = supabase.storage
                                                            .from('products')
                                                            .getPublicUrl(filePath);

                                                        setFormData({ ...formData, image_url: data.publicUrl });
                                                    } catch (error: any) {
                                                        console.error('Error uploading image:', error);
                                                        alert(`Error al subir imagen: ${error.message || error}`);
                                                    }
                                                }
                                            }}
                                            className="w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-black file:text-white
                                                hover:file:bg-gray-800"
                                        />
                                        {formData.image_url && (
                                            <div className="mt-2 text-xs text-green-600">
                                                Imagen cargada correctamente
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Justification Field - Only for Editing */}
                            {editingId && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Justificación del Cambio <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Explica brevemente por qué estás realizando este cambio..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-20 bg-yellow-50"
                                        value={formData.justification}
                                        onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
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
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isCreating || isUpdating ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
