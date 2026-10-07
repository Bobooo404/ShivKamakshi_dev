import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'Get in touch', id: 'contact-cta' },
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#121212]/90 backdrop-blur-md py-4 border-b border-[#D4AF37]/15 shadow-2xl shadow-black/70'
          : 'bg-gradient-to-b from-[#121212]/90 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Identity / Logo */}
        <button
          id="nav-brand-button"
          onClick={() => handleItemClick('home')}
          className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          aria-label="Shiv Kamakshi Developers Home"
        >
          <div className="w-9 h-9 rounded-sm border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden bg-[#1A1A1A] group-hover:border-[#D4AF37] transition-colors duration-300">
            <img
              src="/Logo.jpeg"
              alt="Shiv Kamakshi Developers"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm md:text-base font-semibold tracking-[0.2em] text-[#F7F5F0] uppercase group-hover:text-[#D4AF37] transition-colors duration-300">
              Shiv Kamakshi
            </span>
            <span className="text-[9px] md:text-[10px] tracking-[0.38em] text-[#9E978E] uppercase font-light">
              Developers
            </span>
          </div>
        </button>

        {/* Desktop Navigation - STRICTLY Home, Projects, Our Services */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-5 py-2 text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                  isActive
                    ? 'text-[#F7F5F0]'
                    : 'text-[#9E978E] hover:text-[#F7F5F0]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#E5E1DA] hover:text-[#D4AF37] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu - STRICTLY 3 Items */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-x-0 top-[73px] bg-[#141414]/98 backdrop-blur-xl border-b border-[#D4AF37]/20 px-6 py-6 transition-all duration-300 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center justify-between w-full py-3.5 px-4 text-sm font-medium tracking-[0.2em] uppercase rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#F7F5F0] border-l-2 border-[#D4AF37]'
                      : 'text-[#9E978E] hover:bg-[#1C1C1C] hover:text-[#F7F5F0]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]/60" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
