import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="relative border-t border-[#D4AF37]/15 bg-[#0D0D0D] py-16 px-6 sm:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Company Name */}
        <div className="space-y-1">
          <div className="font-heading text-lg sm:text-xl font-bold tracking-[0.2em] text-[#F7F5F0] uppercase">
            Shiv Kamakshi Developers
          </div>
          <div className="text-[10px] uppercase tracking-[0.38em] text-[#9E978E] font-light">
            Architectural Engineering &amp; Development
          </div>
        </div>

        {/* Fictional Phone Number */}
        <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-[#D4AF37] font-medium">
          +91 XXXXX XXXXX
        </div>
      </div>
    </footer>
  );
};
