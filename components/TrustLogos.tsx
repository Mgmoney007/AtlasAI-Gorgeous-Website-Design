
import React from 'react';

const logos = [
  'EXUSLABS', 'QUANTUM', 'ELEVATE', 'SYNTH', 
  'VALOR', 'NEXUS', 'PRISM', 'OMEGA',
  'STRATOS', 'VELOCITY', 'AURORA', 'ZENITH'
];

const TrustLogos: React.FC = () => {
  return (
    <section className="py-10 border-y border-zinc-900/50 overflow-hidden relative bg-black/20">
      {/* Side Vignette Fades */}
      <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />
      
      <p className="text-center text-[9px] font-bold text-zinc-700 tracking-[0.4em] uppercase mb-10 opacity-60">
        Engineered for global standards
      </p>

      <div className="flex w-fit animate-marquee grayscale">
        {/* We use multiple copies to ensure seamless loop on any screen width */}
        {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
          <div 
            key={i} 
            className="mx-10 md:mx-16 flex items-center justify-center group cursor-default"
          >
            <span className="
              text-2xl md:text-3xl font-black tracking-tighter transition-all duration-700
              text-transparent bg-clip-text bg-gradient-to-b from-zinc-100/35 to-zinc-500/20
              group-hover:from-white group-hover:to-zinc-300
              group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]
              select-none
            ">
              {logo}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustLogos;
