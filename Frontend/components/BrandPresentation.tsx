import { Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export const BrandPresentation = () => {
    return (
        <section className="relative w-full bg-white overflow-hidden" id="brand-presentation">
            <div className="flex flex-col md:flex-row h-auto min-h-[600px]">
                {/* Left Column - Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-full md:w-1/2 relative min-h-[400px]"
                >
                    <img
                        src="/assets/Vogue.jpeg"
                        alt="Botella de Perfume Vogue"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </motion.div>

                {/* Right Column - Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-[#F9F9F9]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="max-w-md mx-auto md:mx-0 text-center md:text-left"
                    >
                        {/* Decorative Star */}
                        <div className="text-yellow-600 text-2xl mb-6">★</div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-gray-900 mb-8 leading-tight">
                            El Arte de <br />
                            <span className="italic text-gray-800">Vestir lo Invisible</span>
                        </h2>

                        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-12 font-light tracking-wide">
                           ​La Excelencia de la Perfumería en un solo lugar
​Glow & essence es tu aliado en fragancias premium 1.1, cosméticos de alta calidad y accesorios que marcan la diferencia. Nos comprometemos a ofrecerte solo lo mejor del mercado, asegurando que cada compra sea una inversión en tu imagen.
​Calidad, Duración y Estilo. Eso es Glow & essence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 items-center md:items-start mt-8">
                            <a
                                href="#"
                                className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-all font-medium"
                            >
                                Leer Más <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>

                            <a
                                href="https://www.facebook.com/share/1DVmG31dZn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-colors font-medium border-b border-transparent hover:border-blue-800 pb-1"
                            >
                                <Facebook className="w-4 h-4" />
                                Facebook
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
