import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from -1 to 1 for control
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Generate subtle layers of stars for depth without distraction
  const starLayers = useMemo(() => {
    const layers = [
      { count: 100, size: [0.4, 0.8], opacity: [0.05, 0.15], parallax: 0.01, mouseFactor: 2 },   
      { count: 60, size: [0.8, 1.2], opacity: [0.1, 0.25], parallax: 0.08, mouseFactor: 8 },  
      { count: 25, size: [1.2, 1.6], opacity: [0.15, 0.35], parallax: 0.2, mouseFactor: 15 },  
      { count: 8, size: [1.8, 2.5], opacity: [0.2, 0.4], parallax: 0.4, mouseFactor: 30 },   
    ];

    return layers.map((layer, layerIdx) => 
      Array.from({ length: layer.count }).map((_, i) => ({
        id: `layer-${layerIdx}-star-${i}`,
        top: `${Math.random() * 110}%`,
        left: `${Math.random() * 110}%`,
        size: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
        opacity: Math.random() * (layer.opacity[1] - layer.opacity[0]) + layer.opacity[0],
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 10,
        parallaxFactor: layer.parallax,
        mouseFactor: layer.mouseFactor,
        color: Math.random() > 0.92 ? '#BFF549' : '#ffffff',
        glow: false,
      }))
    );
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] md:min-h-screen pt-40 sm:pt-48 pb-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden bg-zinc-950">
      {/* Space Background Layer - Fixed and Z-Index -10 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        {starLayers.map((layer, lIdx) => (
          <div 
            key={`layer-${lIdx}`}
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translate3d(${mousePos.x * (lIdx + 1) * 1.5}px, ${mousePos.y * (lIdx + 1) * 1.5}px, 0)`,
              transition: 'transform 0.4s ease-out'
            }}
          >
            {layer.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full animate-pulse"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  backgroundColor: star.color,
                  animationDuration: `${star.duration}s`,
                  animationDelay: `${star.delay}s`,
                  transform: `translate3d(${mousePos.x * star.mouseFactor * 0.05}px, ${scrollY * star.parallaxFactor * -0.2}px, 0)`,
                  transition: 'transform 0.15s linear'
                }}
              />
            ))}
          </div>
        ))}

        {/* Shooting Stars */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(3)].map((_, i) => (
            <div 
              key={`shooting-${i}`}
              className="absolute w-[100px] sm:w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#BFF549] to-transparent rotate-[-35deg] opacity-0 animate-shooting-star"
              style={{
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 70}%`,
                animationDelay: `${i * 12 + Math.random() * 20}s`,
                animationDuration: '8s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Layer - Z-Index 10 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Refined Badge - More subtle to balance with Header Logo */}
        <div 
          aria-hidden="true"
          className="mb-8 sm:mb-10 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass border border-zinc-800/80 animate-fade-in scale-90 sm:scale-100 group/badge hover:border-zinc-700 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#BFF549] shadow-[0_0_8px_#BFF549]" />
          <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#BFF549]" /> Conversion Optimized
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[140px] font-black tracking-tighter leading-[0.82] text-white max-w-6xl mb-8 sm:mb-12 select-none">
          WE BUILD <br />
          <span className="text-zinc-600/80">GORGEOUS</span> <br />
          <span className="bg-gradient-to-b from-[#BFF549] to-[#8eb836] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(191,245,73,0.25)]">WEBSITES.</span>
        </h1>

        <p className="max-w-xl text-zinc-400 text-base sm:text-lg md:text-xl mb-12 sm:mb-16 leading-relaxed px-4 sm:px-0 opacity-80">
          Precision design that converts.<br />
          Performance engineered for scale.
        </p>

        {/* Refined Button widths and padding for better congruency */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto max-w-[500px] sm:max-w-none px-10 sm:px-0">
          <button 
            className="h-14 px-8 rounded-xl bg-[#BFF549] text-zinc-950 font-black text-base hover:bg-[#BFF549]/90 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(191,245,73,0.2)] group active:scale-95"
            aria-label="Start your website design and performance audit"
          >
            Start Your Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            className="h-14 px-8 rounded-xl glass border border-zinc-800 text-white font-bold text-base hover:border-[#BFF549]/40 hover:bg-white/10 transition-all active:scale-95"
            aria-label="View our design and development process"
          >
            Our Process
          </button>
        </div>
      </div>

      {/* Atmospheric Glows - Z-Index 5 */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        <div 
          className="absolute top-[5%] left-[-10%] w-[500px] sm:w-[900px] h-[500px] sm:h-[900px] bg-[#BFF549]/5 blur-[120px] sm:blur-[240px] rounded-full animate-pulse transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate3d(${mousePos.x * -15}px, ${scrollY * 0.02 + mousePos.y * -15}px, 0)`
          }} 
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[#BFF549]/3 blur-[100px] sm:blur-[220px] rounded-full animate-pulse transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate3d(${mousePos.x * 20}px, ${scrollY * 0.04 + mousePos.y * 20}px, 0)`,
            animationDelay: '1.5s'
          }} 
        />
      </div>

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay z-20 pointer-events-none" />
      
      <style>{`
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          25% { transform: translateX(600px) translateY(400px) scale(0.1); opacity: 0; }
          100% { transform: translateX(600px) translateY(400px) scale(0.1); opacity: 0; }
        }
        .animate-shooting-star {
          animation: shooting-star 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;