import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  // Body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Expertise', href: '#features' },
    { name: 'Evidence', href: '#testimonials' },
    { name: 'Audit', href: '#audit' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3 md:py-4 glass border-b border-zinc-800' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Logo className="transform group-hover:rotate-6 transition-transform duration-500" size={36} />
          <span className="text-xl font-bold tracking-tighter text-white uppercase italic">ATLAS AI</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-sm font-bold text-zinc-400 hover:text-white transition-colors group py-1 uppercase tracking-widest"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#BFF549] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
          <a 
            href="#audit" 
            onClick={(e) => handleNavClick(e, '#audit')}
            className="bg-white text-zinc-950 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#BFF549] transition-all hover:scale-105 flex items-center gap-2 shadow-xl"
          >
            Book Strategy <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Modal behavior with solid background and scroll locking */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-zinc-950 transition-all duration-500 ease-in-out md:hidden overflow-hidden z-40 ${
          isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-4xl font-black text-zinc-300 hover:text-[#BFF549] transition-colors uppercase tracking-tighter" 
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#audit" 
            className="w-full max-w-xs bg-[#BFF549] text-zinc-950 py-6 rounded-2xl font-black text-2xl text-center uppercase tracking-widest shadow-2xl"
            onClick={(e) => handleNavClick(e, '#audit')}
          >
            Book Strategy
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;