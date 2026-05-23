import React from 'react';

export const HeroSection = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
                {/* Video de fondo: Vogueperfum.mp4 (en raiz de public) */}
                <source src="/Vogueperfum.mp4" type="video/mp4" />
            </video>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                <h2 className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Nueva Colección 2026
                </h2>

                {/* Main Title - Mixed Typography */}
                <div className="flex flex-col md:flex-row items-center justify-center mb-10 animate-in fade-in zoom-in duration-1000 delay-150">
                    <div className="flex items-baseline justify-center">
                        <span className="text-5xl md:text-7xl lg:text-8xl xl:text-[110px] font-bold text-white tracking-tighter">
                            GLOW
                        </span>
                        <span className="text-4xl md:text-6xl lg:text-7xl xl:text-[80px] font-playfair italic text-white ml-3 md:ml-5 font-light">
                            &
                        </span>
                    </div>
                    <span className="text-6xl md:text-8xl lg:text-[110px] xl:text-[140px] font-playfair italic text-white font-medium mt-2 md:mt-0 md:ml-6">
                        essence
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
    );
};
