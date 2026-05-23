import React from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Main Footer Content */}
                <div className="text-center space-y-4">
                    {/* Brand Name */}
                    <h3 className="text-lg md:text-xl font-bold tracking-widest uppercase font-playfair italic">
                        Glow & essence<sup className="text-[10px]">®</sup>
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-600">
                        Mérida, Yucatán, México
                    </p>

                    {/* Copyright Notice */}
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                        © {currentYear} Glow & essence<sup className="text-[8px]">®</sup>. Todos los derechos reservados.
                    </p>

                    {/* Legal Disclaimer */}
                    <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Glow & essence<sup className="text-[8px]">®</sup> es una marca registrada.
                        Todas las marcas comerciales y nombres de productos mencionados son propiedad de sus respectivos dueños.
                    </p>
                </div>
            </div>
        </footer>
    );
};
