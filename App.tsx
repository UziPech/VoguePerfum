import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Plus, Minus, Trash2, ArrowRight, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { Product, CartItem, Category } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  
  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll Effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'Todo' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Wishlist Products
  const wishlistProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => wishlist.has(product.id));
  }, [wishlist]);

  // New Arrivals (Just for the Slider)
  const newArrivals = MOCK_PRODUCTS.slice(0, 5); // Take first 5 as "New"

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist Actions
  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(id)) {
        newWishlist.delete(id);
      } else {
        newWishlist.add(id);
      }
      return newWishlist;
    });
  };

  // WhatsApp Checkout
  const handleCheckout = () => {
    const message = `Hola, me gustaría ordenar los siguientes productos:\n\n${cart.map(item => `- ${item.name} (${item.quantity}) - $${item.price * item.quantity}`).join('\n')}\n\nTotal: $${cartTotal.toFixed(2)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* CSS for Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Fixed Navbar with Transition */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 text-black py-4' 
            : 'bg-transparent text-white py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            </div>

            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold tracking-[0.2em] text-center md:text-left flex-1 md:flex-none uppercase">
              Vogue Perfum
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-70 transition-opacity">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button 
                onClick={() => setIsWishlistOpen(true)}
                className="relative hidden md:block group cursor-pointer hover:opacity-70 transition-opacity"
              >
                <Heart className={`w-6 h-6 transition-colors ${wishlist.size > 0 ? 'fill-current' : ''}`} />
                {wishlist.size > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[10px] w-4 h-4 flex items-center justify-center rounded-full ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    {wishlist.size}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative hover:opacity-70 transition-opacity"
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[10px] w-4 h-4 flex items-center justify-center rounded-full ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH MODAL (Glassmorphism Overlay) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
             onClick={() => setIsSearchOpen(false)}
           />
           
           {/* Search Container */}
           <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-top-10 duration-500">
              <div className="flex items-center gap-4">
                 <Search className="w-6 h-6 text-white/70" />
                 <input 
                   type="text" 
                   placeholder="Buscar perfumes, marcas..." 
                   className="w-full bg-transparent border-none text-xl md:text-2xl text-white placeholder-white/50 focus:ring-0 outline-none font-playfair italic"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   autoFocus
                 />
                 <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6 text-white" />
                 </button>
              </div>
              
              {/* Quick Results Preview (Optional) */}
              {searchQuery && (
                <div className="mt-6 pt-6 border-t border-white/10">
                   <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Resultados</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.slice(0, 4).map(product => (
                        <div key={product.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => { setIsSearchOpen(false); }}>
                           <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md opacity-80 group-hover:opacity-100" />
                           <div>
                              <p className="text-white text-sm font-medium">{product.name}</p>
                              <p className="text-white/50 text-xs">{product.brand}</p>
                           </div>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="text-white/70 italic">No se encontraron resultados.</p>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Hero Section (Video Background) */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
           {/* Abstract elegant liquid/smoke video placeholder */}
           <source src="https://videos.pexels.com/video-files/3205917/3205917-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          <h2 className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Nueva Colección 2024
          </h2>
          
          {/* Main Title - Mixed Typography */}
          <div className="flex flex-col md:block items-center justify-center mb-10 animate-in fade-in zoom-in duration-1000 delay-150">
            <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter mr-0 md:mr-4">
              VOGUE
            </span>
            <span className="text-5xl md:text-7xl lg:text-8xl font-playfair italic text-white font-medium">
              Perfum
            </span>
          </div>

          <button 
            onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative px-8 py-3 border border-white text-white overflow-hidden transition-all hover:px-10"
          >
             <span className="relative z-10 text-xs md:text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
               Explorar Colección
             </span>
             <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 opacity-20"></div>
          </button>
        </div>
      </section>

      {/* Infinite Marquee Slider */}
      <div className="bg-black text-white py-4 overflow-hidden border-b border-gray-800">
        <div className="flex w-max animate-marquee hover:pause">
           {/* Duplicating content to ensure seamless loop */}
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex space-x-12 mx-6 items-center">
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-gray-400">Tom Ford</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-white">Dior</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-gray-400">Chanel</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-white">Creed</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-gray-400">Le Labo</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
               <span className="text-lg md:text-xl font-light tracking-widest uppercase text-white">YSL</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
             </div>
           ))}
        </div>
      </div>

      {/* NEW SECTION: Horizontal Scroll Slider ("New Arrivals") */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
          <h3 className="text-3xl md:text-4xl font-playfair italic text-gray-900">
            New Arrivals
          </h3>
          <div className="hidden md:flex gap-2">
            <span className="text-xs tracking-widest uppercase text-gray-400">Drag to explore</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* The Slider Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 md:px-8 pb-8 no-scrollbar">
          {newArrivals.map((product) => (
            <div 
              key={`new-${product.id}`} 
              className="snap-center flex-shrink-0 w-[85vw] md:w-[350px] group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <button 
                   onClick={() => addToCart(product)}
                   className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">{product.brand}</h4>
                  <h3 className="text-lg font-playfair font-medium text-gray-900">{product.name}</h3>
                </div>
                <span className="text-sm font-semibold">${product.price}</span>
              </div>
            </div>
          ))}
          {/* Spacer for end of list */}
          <div className="w-4 flex-shrink-0" />
        </div>
      </section>

      {/* Catalog Anchor */}
      <div id="catalog" />

      {/* Categories Tabs (Sticky below normal flow) */}
      <div className="bg-white sticky top-[72px] z-30 pt-4 pb-2 border-b border-gray-100/50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-8 py-4 whitespace-nowrap min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'text-black font-bold border-b border-black pb-1'
                    : 'text-gray-400 hover:text-gray-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-10 w-full bg-white">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-2xl font-light text-gray-900 tracking-wide uppercase">
            {selectedCategory === 'Todo' ? 'Catálogo' : selectedCategory}
          </h2>
          <span className="text-xs text-gray-400 tracking-widest uppercase">{filteredProducts.length} items</span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-12 md:gap-x-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col relative cursor-pointer">
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-gray-100 mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  
                  {/* Floating Heart */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/50 transition-all active:scale-95"
                  >
                    <Heart 
                      className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-black text-black' : 'text-gray-600'}`} 
                    />
                  </button>
                  
                  {/* New Badge */}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[9px] uppercase font-bold px-2 py-1 tracking-widest border border-gray-100">
                      New In
                    </span>
                  )}

                   {/* Quick Add Button (Desktop Hover) */}
                   <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md text-black py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block text-xs font-bold uppercase tracking-widest border-t border-gray-100 hover:bg-black hover:text-white"
                  >
                    Agregar al Carrito
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow px-1">
                  <h3 className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">{product.brand}</h3>
                  <h2 className="text-sm font-medium text-gray-900 leading-tight mb-2 truncate font-playfair">{product.name}</h2>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                    {/* Mobile Add Button */}
                    <button 
                      onClick={() => addToCart(product)}
                      className="md:hidden w-8 h-8 flex items-center justify-center bg-black text-white rounded-full active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <p className="text-gray-500 font-light">No se encontraron productos.</p>
             <button onClick={() => {setSelectedCategory('Todo'); setSearchQuery('');}} className="mt-4 text-black border-b border-black text-sm uppercase tracking-wider pb-1">Ver todo</button>
          </div>
        )}
      </main>

      {/* Footer Simple */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-bold tracking-widest uppercase mb-4 font-playfair italic">Vogue Perfum</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">© 2024 All rights reserved.</p>
        </div>
      </footer>

      {/* WISHLIST DRAWER (Glassmorphism) */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500 border-l border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-lg font-light tracking-[0.2em] uppercase">Favoritos ({wishlist.size})</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {wishlistProducts.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                   <Heart className="w-12 h-12 opacity-20" />
                   <p className="font-light">Tu lista de deseos está vacía.</p>
                 </div>
               ) : (
                 wishlistProducts.map(item => (
                   <div key={item.id} className="flex gap-4 items-center">
                     <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-playfair font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                        <p className="text-xs font-semibold mt-1">${item.price}</p>
                     </div>
                     <button onClick={() => {addToCart(item); setIsWishlistOpen(false);}} className="p-2 bg-black text-white rounded-full hover:scale-105 transition-transform">
                        <Plus className="w-4 h-4" />
                     </button>
                     <button onClick={() => toggleWishlist(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer / Overlay (Glassmorphism) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Drawer - Glassmorphism Applied */}
          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500 border-l border-white/20">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-lg font-light tracking-[0.2em] uppercase">Tu Bolsa ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="font-light">Tu bolsa está vacía.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-black font-medium border-b border-black text-sm pb-1 uppercase tracking-wider"
                  >
                    Descubrir Aromas
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm text-gray-900 tracking-wide font-playfair">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{item.brand}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                         <div className="flex items-center border border-gray-300">
                           <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            disabled={item.quantity <= 1}
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <span className="px-3 text-xs font-medium">{item.quantity}</span>
                           <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                         </div>
                         <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200/50 p-6 space-y-4 bg-gray-50/50 backdrop-blur-md">
                <div className="flex justify-between items-center text-base font-medium text-gray-900">
                  <span className="uppercase tracking-widest text-sm">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-wider">Impuestos y envío calculados al finalizar.</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-3"
                >
                  Finalizar en WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}