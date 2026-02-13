import React, { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { DataTable } from '../../components/admin/DataTable';
import { useGetProductsQuery, useGetBrandsQuery, useGetCategoriesQuery, useCreateProductMutation } from '../../store/api/catalogApi';
import { useAppSelector } from '../../store/hooks';

export const Products: React.FC = () => {
    const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 100 });
    const { data: brands } = useGetBrandsQuery();
    const { data: categories } = useGetCategoriesQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const { user } = useAppSelector((state) => state.auth);
    const products = data?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        image_url: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProduct({
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            }).unwrap();
            setIsModalOpen(false);
            setFormData({ name: '', description: '', price: '', stock: '', category_id: '', brand_id: '', image_url: '' });
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Error creating product');
        }
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
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Producto
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search bar could go here */}

                <div className="overflow-x-auto">
                    <DataTable
                        data={products}
                        columns={columns}
                        onEdit={(item) => console.log('Edit', item)}
                        onDelete={(item) => console.log('Delete', item)}
                    />
                </div>
            </div>

            {/* Create Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-serif font-bold mb-6">Nuevo Producto</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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

                            <div className="flex justify-end gap-3 pt-4">
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
                                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isCreating ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
