import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Check, Star } from 'lucide-react';
import { useGetProductQuery, useGetProductReviewsQuery, useCreateReviewMutation, useGetProductsQuery } from '../store/api/catalogApi';
import { useShop } from '../../hooks/useShop';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistDrawer } from '../../components/WishlistDrawer';
import { StarRating } from '../../components/StarRating';
import { ProductCard } from '../../components/ProductCard';
import { useAppSelector } from '../store/hooks';

export const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    // Queries
    const { data: product, isLoading: productLoading } = useGetProductQuery(id);
    const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviewsQuery(id);
    const [createReview, { isLoading: isReviewing }] = useCreateReviewMutation();
    const categorySlug = product?.categories?.slug;
    const { data: relatedData } = useGetProductsQuery(
        { limit: 12, ...(categorySlug ? { category_slug: categorySlug } : {}) },
        { skip: !product }
    );
    const relatedProducts = relatedData?.data || [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const randomizedRelatedProducts = useMemo(() => {
        return [...relatedProducts]
            .filter((p: any) => Number(p.id) !== Number(product?.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);
    }, [relatedProducts, product?.id]);

    // Shop Logic (Cart, Wishlist, Navbar state)
    const {
        cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
        wishlist, toggleWishlist, wishlistProducts,
        isCartOpen, setIsCartOpen,
        isWishlistOpen, setIsWishlistOpen,
        isSearchOpen, setIsSearchOpen
    } = useShop();

    // Local UI State
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (rating === 0) {
            setError('Por favor selecciona una calificación.');
            return;
        }

        try {
            await createReview({
                product_id: id,
                rating,
                comment
            }).unwrap();
            setRating(0);
            setComment('');
        } catch (err: any) {
            setError(err.data?.error || 'Error al enviar la reseña.');
        }
    };

    if (productLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div></div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Producto no encontrado.</div>;
    }

    const reviews = reviewsData?.reviews || [];
    const stats = reviewsData?.stats || { averageRating: 0, totalReviews: 0 };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            <Navbar
                scrolled={true}
                cartCount={cartCount}
                wishlistCount={wishlist.size}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                user={user}
            />

            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-black mb-8 group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al catálogo
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Image Gallery */}
                    <div className="mb-10 lg:mb-0">
                        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative group max-w-sm mx-auto shadow-lg">
                            <img
                                src={product.image_url || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                                loading="eager"
                                decoding="async"
                            />
                            {(product.is_new || product.isNew) && (
                                <span className="absolute top-4 left-4 bg-black text-white text-xs uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                                    Nuevo
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{product.brands?.name || product.brand}</h2>
                            <h1 className="text-3xl lg:text-4xl font-serif font-medium text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                <div
                                    className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                                    onClick={() => {
                                        setActiveTab('reviews');
                                        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <StarRating rating={stats.averageRating} size={18} />
                                    <span className="ml-2 text-sm text-gray-500">({stats.totalReviews} reseñas)</span>
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

                            <div className="prose prose-sm text-gray-600 mb-8">
                                <p>{product.description || "Una fragancia excepcional que captura la esencia de la elegancia moderna."}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-black text-white py-4 px-8 flex items-center justify-center uppercase tracking-widest text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="w-5 h-5 mr-3" />
                                    {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`p-4 border border-gray-300 flex items-center justify-center transition-all duration-300 transform active:scale-90 ${wishlist.has(product.id)
                                        ? 'bg-red-50 border-red-200 text-red-500 scale-110'
                                        : 'hover:bg-gray-50 text-gray-900 hover:scale-105'
                                        }`}
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-all duration-300 ${wishlist.has(product.id) ? 'fill-current animate-pulse' : ''
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Tabs: Description & Reviews */}
                        <div className="border-t border-gray-200 mt-10 pt-10 scroll-mt-28" id="reviews-section">
                            <div className="flex space-x-8 border-b border-gray-200 mb-8">
                                <button
                                    className={`pb-4 text-sm font-medium uppercase tracking-wider ${activeTab === 'description' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Descripción
                                </button>
                                <button
                                    className={`pb-4 text-sm font-medium uppercase tracking-wider ${activeTab === 'reviews' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Reseñas ({stats.totalReviews})
                                </button>
                            </div>

                            {activeTab === 'description' ? (
                                <div className="text-gray-600 leading-relaxed text-sm">
                                    <p>{product.description || "Sin descripción detallada."}</p>

                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {/* Create Review Form */}
                                    {user ? (
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-medium mb-4">Escribir una reseña</h3>
                                            <form onSubmit={handleSubmitReview}>
                                                <div className="mb-4">
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Calificación</label>
                                                    <StarRating rating={rating} interactive onChange={setRating} size={24} />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Comentario</label>
                                                    <textarea
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none text-sm"
                                                        rows={4}
                                                        placeholder="Cuéntanos qué te pareció este perfume..."
                                                    />
                                                </div>
                                                {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                                                <button
                                                    type="submit"
                                                    disabled={isReviewing}
                                                    className="bg-black text-white px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                >
                                                    {isReviewing ? 'Enviando...' : 'Publicar Reseña'}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-6 text-center rounded-lg">
                                            <p className="text-gray-600 text-sm mb-4">Inicia sesión para escribir una reseña.</p>
                                            <button onClick={() => navigate('/admin/login')} className="text-black border-b border-black text-xs uppercase font-bold tracking-widest pb-1">
                                                Ir a Login
                                            </button>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <div className="space-y-6">
                                        {reviews.length === 0 ? (
                                            <p className="text-gray-500 italic text-sm">Aún no hay reseñas. ¡Sé el primero!</p>
                                        ) : (
                                            reviews.map((review: any) => (
                                                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-sm text-gray-900">{review.profiles?.full_name || review.profiles?.name || 'Usuario'}</h4>
                                                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <StarRating rating={review.rating} size={14} className="mb-3" />
                                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-10 border-t border-gray-100">
                    <h2 className="text-2xl font-serif font-medium text-gray-900 mb-8 text-center uppercase tracking-widest">También te puede interesar</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {randomizedRelatedProducts.map((relatedProduct: any) => (
                            <ProductCard
                                key={relatedProduct.id}
                                product={relatedProduct}
                                isInWishlist={wishlist.has(relatedProduct.id)}
                                onAddToCart={addToCart}
                                onToggleWishlist={toggleWishlist}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
            />

            <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistProducts}
                onAddToCart={addToCart}
                onRemove={toggleWishlist}
            />
        </div>
    );
};
