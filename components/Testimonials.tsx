
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'NexusLabs',
    content: "The ROI was immediate. Atlas AI didn't just redesign our site; they redesigned our entire sales approach through visual storytelling.",
    image: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Growth',
    company: 'Quantum Finance',
    content: "Sub-100ms load times changed our PPC performance overnight. Our cost-per-acquisition dropped by 42%.",
    image: 'https://picsum.photos/seed/marcus/100/100'
  },
  {
    name: 'David Vane',
    role: 'Founder',
    company: 'Bloom eCommerce',
    content: "We've worked with many agencies, but Atlas AI is the only one that truly understands the intersection of high-end aesthetics and conversion data.",
    image: 'https://picsum.photos/seed/david/100/100'
  },
  {
    name: 'Elena Rossi',
    role: 'Product Lead',
    company: 'Arca OS',
    content: "The level of animation and polish they brought to our landing page is unmatched. It feels like the future of the web.",
    image: 'https://picsum.photos/seed/elena/100/100'
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="testimonials" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-[#BFF549] font-bold tracking-widest uppercase text-xs mb-4">The Evidence Wall</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Founders Who <br className="hidden md:block" /> Stopped Guessing.
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel Area */}
          <div className="overflow-hidden rounded-[40px]">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-4">
                  <div className="glass p-10 md:p-16 rounded-[40px] border border-zinc-800 relative group overflow-hidden">
                    <Quote className="absolute top-8 right-8 w-24 h-24 text-zinc-800 opacity-20 group-hover:text-[#BFF549]/20 transition-colors" />
                    
                    <div className="flex gap-1 mb-10">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-[#BFF549] text-[#BFF549]" />
                      ))}
                    </div>

                    <p className="text-2xl md:text-4xl text-zinc-300 mb-12 leading-relaxed italic font-serif relative z-10">
                      "{t.content}"
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-zinc-800 shadow-2xl">
                        <img 
                          src={t.image} 
                          alt={t.name} 
                          className={`w-full h-full object-cover transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) ${
                            activeIndex === i 
                              ? 'scale-110 opacity-100' 
                              : 'scale-75 opacity-20'
                          }`} 
                        />
                      </div>
                      <div className={`transition-all duration-700 delay-200 ${
                        activeIndex === i 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-4 opacity-0'
                      }`}>
                        <h4 className="text-xl font-bold text-white">{t.name}</h4>
                        <p className="text-[#BFF549] font-medium">{t.role} @ {t.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-zinc-800 flex items-center justify-center text-white hover:border-[#BFF549] hover:text-[#BFF549] transition-all shadow-xl group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
            <button 
              onClick={nextSlide}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-zinc-800 flex items-center justify-center text-white hover:border-[#BFF549] hover:text-[#BFF549] transition-all shadow-xl group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeIndex === i ? 'w-12 bg-[#BFF549]' : 'w-4 bg-zinc-800 hover:bg-zinc-700'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-[#BFF549]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-[#BFF549]/5 blur-[150px] rounded-full" />
      </div>
    </section>
  );
};

export default Testimonials;
