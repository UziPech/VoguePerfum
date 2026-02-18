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
                {/* Abstract elegant liquid/smoke video placeholder */}
                <source src="https://videos.pexels.com/video-files/3205917/3205917-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                <h2 className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Nueva Colección 2026
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
    );
};
