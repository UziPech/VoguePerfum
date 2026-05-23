import React from 'react';

export const Marquee = () => {
    return (
        <div className="bg-black text-white py-8 md:py-10 overflow-hidden border-b border-gray-800">
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
            <div className="flex w-max animate-marquee hover:pause">
                {/* Duplicating content to ensure seamless loop */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex space-x-12 mx-6 items-center">
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-400">Tom Ford</span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-white">Dior</span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-400">Chanel</span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-white">Creed</span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-400">Le Labo</span>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                        <span className="text-xl md:text-2xl font-light tracking-widest uppercase text-white">YSL</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    </div>
                ))}
            </div>
        </div>
    );
};
