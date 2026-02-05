
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, X, Clock, CheckCircle2 } from 'lucide-react';

const CTASection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({
        x: (x / rect.width - 0.5),
        y: (y / rect.height - 0.5),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Body scroll locking when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Generate subtle drifting particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <section id="audit" className="py-32 px-6">
      <div 
        ref={sectionRef}
        className="max-w-5xl mx-auto bg-[#0c0c0e] rounded-[40px] p-12 md:p-24 border border-zinc-800 text-center relative overflow-hidden group shadow-2xl"
      >
        {/* Interactive Glow Background */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(191, 245, 73, 0.08) 0%, transparent 50%)`,
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute bg-[#BFF549] rounded-full animate-float"
              style={{
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * 30}px, 0)`,
                transition: 'transform 0.4s ease-out'
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#BFF549]/20 bg-[#BFF549]/5 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFF549] animate-pulse" />
            <span className="text-[10px] font-bold text-[#BFF549] uppercase tracking-[0.2em]">Limited Slots for Q2 2026</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
            READY TO STOP <br />
            <span className="text-zinc-500">GORGEOUSLY</span> GUESSING?
          </h2>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the founders who replaced assumptions with mathematical certainty. We're currently accepting 3 new projects for our high-velocity sprint.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative overflow-hidden w-full sm:w-auto h-20 px-12 rounded-2xl bg-white text-zinc-950 font-black text-xl hover:bg-[#BFF549] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center gap-4 group/btn animate-pulse-glow"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[200%] skew-x-[-30deg] group-hover/btn:animate-shimmer-fast pointer-events-none z-20" />
              <span className="relative z-10">Book Your Free Call</span>
              <ArrowRight className="relative z-10 w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="w-full sm:w-auto h-20 px-12 rounded-2xl glass border border-zinc-800 text-white font-bold text-lg hover:border-[#BFF549]/40 transition-all hover:bg-white/10 active:scale-95">
              Check Our Work
            </button>
          </div>
        </div>

        {/* Strategy Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
            {/* Solid Backdrop */}
            <div 
              className="absolute inset-0 bg-zinc-950" 
              onClick={() => setIsModalOpen(false)}
            />
            
            <div className="relative z-10 w-full max-w-3xl px-6 py-12 text-center animate-scale-in">
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 md:top-4 right-6 md:-right-12 text-zinc-500 hover:text-white transition-colors p-2"
              >
                <X size={32} />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#BFF549]/20 bg-[#BFF549]/5 mb-10">
                  <Clock className="w-4 h-4 text-[#BFF549]" />
                  <span className="text-xs font-black text-[#BFF549] uppercase tracking-[0.2em]">Limited availability — Q2 2026</span>
                </div>

                <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                  READY TO STOP GUESSING — <br />
                  <span className="text-[#BFF549]">AND START WINNING?</span>
                </h3>

                <p className="text-zinc-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                  Get absolute clarity on your conversion funnel, sub-100ms technical speed for your UX, and measurable growth for your bottom line. <span className="text-white">We are currently accepting only 3 new projects</span> for our next high-velocity sprint.
                </p>

                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                  <button className="w-full h-24 bg-[#BFF549] text-zinc-950 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(191,245,73,0.3)] group/modal-btn">
                    Start My Strategy Call <ArrowRight className="w-8 h-8 group-hover/modal-btn:translate-x-2 transition-transform" />
                  </button>
                  
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.1em] text-sm">
                      No pitch. No obligation. Clear next steps.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-zinc-700" /> 30-Min Deep Dive
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-zinc-700" /> Revenue Audit
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-zinc-700" /> Speed Check
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Static Blur Accents (Subtle) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#BFF549]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#BFF549]/3 blur-[120px] rounded-full" />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(20px); }
            75% { transform: translateY(10px) translateX(-10px); }
          }
          @keyframes shimmer-fast {
            0% { transform: translateX(-200%) skewX(-30deg); }
            100% { transform: translateX(200%) skewX(-30deg); }
          }
          @keyframes pulse-glow {
            0% { 
              box-shadow: 0 0 0 0 rgba(191, 245, 73, 0.7), 0 0 30px rgba(191, 245, 73, 0.2), 0 20px 50px rgba(0,0,0,0.5);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 0 20px rgba(191, 245, 73, 0), 0 0 60px rgba(191, 245, 73, 0.4), 0 20px 50px rgba(0,0,0,0.5);
              transform: scale(1.02);
            }
            100% { 
              box-shadow: 0 0 0 0 rgba(191, 245, 73, 0), 0 0 30px rgba(191, 245, 73, 0.2), 0 20px 50px rgba(0,0,0,0.5);
              transform: scale(1);
            }
          }
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-float {
            animation: float linear infinite;
          }
          .group-hover\/btn\:animate-shimmer-fast {
            animation: shimmer-fast 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }
          .animate-scale-in {
            animation: scale-in 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          .animate-fade-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </section>
  );
};

export default CTASection;
