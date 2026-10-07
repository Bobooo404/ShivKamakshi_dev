import React from 'react';
import { Building2 } from 'lucide-react';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onExploreServices,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Top architectural badge */}
      <div className="pt-4 flex items-center justify-between pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#181818]/90 border border-[#D4AF37]/25 text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Architectural Studio Showcase</span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[11px] tracking-[0.25em] text-[#9E978E] uppercase font-light">
          <span>Structural Precision</span>
        </div>
      </div>

      {/* Center/Hero typography */}
      <div className="my-auto py-12 sm:py-20 max-w-3xl pointer-events-auto">
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.38em] text-[#D4AF37] uppercase">
            Shiv Kamakshi Developers
          </p>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F7F5F0] leading-[1.08]">
            Construction & Development Solutions{' '}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7F5F0] via-[#E5E1DA] to-[#D4AF37]">
              Across Goa.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#C9C3B8] font-light max-w-xl leading-relaxed pt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Crafting distinctive spaces through thoughtful design, precision and vision.
          </p>
        </div>

        {/* Minimal CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-8">
          <button
            id="hero-explore-projects-btn"
            onClick={onExploreProjects}
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#D4AF37] text-[#121212] text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#E5C158] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <span>Explore Our Projects</span>
            <Building2 className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <button
            id="hero-our-services-btn"
            onClick={onExploreServices}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#181818]/90 text-[#E5E1DA] text-xs font-medium uppercase tracking-[0.2em] border border-[#D4AF37]/30 transition-all duration-300 hover:bg-[#24221F] hover:border-[#D4AF37]/60 hover:text-[#F7F5F0] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <span>Our Services</span>
          </button>
        </div>
      </div>
    </section>
  );
};
