
import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustLogos from './components/TrustLogos';
import Scanner from './components/Scanner';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Global Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] bg-[#BFF549]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <Header />

      <main>
        <Hero />
        <TrustLogos />
        <Scanner />
        <Features />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default App;