
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-zinc-900 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <Logo size={44} />
            <span className="text-2xl font-bold tracking-tighter text-white uppercase italic">Atlas AI</span>
          </div>
          <p className="text-zinc-500 max-w-xs leading-relaxed">
            The high-conversion design agency for modern founders. Engineered in London, deployed globally.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h5>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Portfolio</a></li>
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Team</a></li>
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h5>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-[#BFF549] transition-colors">Support</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-600 text-xs">
          © 2026 Atlas AI. All rights reserved.
        </p>
        <div className="flex flex-col items-center md:items-end">
          <p className="text-zinc-700 text-[10px] max-w-sm text-center md:text-right uppercase tracking-tighter mb-2">
            Results depend on individual effort and market variables. Intelligence provided for strategy purposes only.
          </p>
          <div className="w-12 h-1 bg-[#BFF549]/20 rounded-full" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
