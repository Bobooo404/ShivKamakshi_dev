import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS_DATA } from '../data/mockData';
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Building2,
  ArrowLeft,
} from 'lucide-react';

interface ProjectsSectionProps {
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  activeProjectIndex,
  onSelectProject,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [mainManual, setMainManual] = useState<boolean>(false);
  const [fsManual, setFsManual] = useState<boolean>(false);

  const currentProject = PROJECTS_DATA[activeProjectIndex] || PROJECTS_DATA[0];

  // Default project image gallery
  const effectiveImages = currentProject.images || [];

  const handlePrevImage = () => {
    if (effectiveImages.length === 0) return;
    setActiveImageIndex((prev) => (prev === 0 ? effectiveImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (effectiveImages.length === 0) return;
    setActiveImageIndex((prev) => (prev === effectiveImages.length - 1 ? 0 : prev + 1));
  };

  // Mobile: auto-advance images every 2 seconds (stops once user takes manual control)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    if (!mq.matches || effectiveImages.length < 2 || fullscreenImage || mainManual) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) =>
        prev === effectiveImages.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => window.clearInterval(timer);
  }, [effectiveImages.length, fullscreenImage, activeProjectIndex, mainManual]);

  // Fullscreen (mobile): auto-advance images every 2 seconds (stops once user swipes)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    if (!mq.matches || !fullscreenImage || effectiveImages.length < 2 || fsManual) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) =>
        prev === effectiveImages.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => window.clearInterval(timer);
  }, [fullscreenImage, effectiveImages.length, activeProjectIndex, fsManual]);

  // Touch swipe for main gallery
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setMainManual(true);
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }
  };

  // Fullscreen: keyboard navigation
  useEffect(() => {
    if (!fullscreenImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setFsManual(true);
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        setFsManual(true);
        handlePrevImage();
      } else if (e.key === 'Escape') setFullscreenImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage]);

  // Fullscreen: wheel / scroll to change images
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fullscreenRef.current;
    if (!el || !fullscreenImage) return;
    let lastWheel = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 400) return;
      lastWheel = now;
      if (e.deltaY > 0) {
        setFsManual(true);
        handleNextImage();
      } else if (e.deltaY < 0) {
        setFsManual(true);
        handlePrevImage();
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [fullscreenImage]);

  // Fullscreen: touch swipe
  const fsTouchStartX = useRef(0);

  const handleFsTouchStart = (e: React.TouchEvent) => {
    fsTouchStartX.current = e.touches[0].clientX;
  };

  const handleFsTouchEnd = (e: React.TouchEvent) => {
    const diff = fsTouchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setFsManual(true);
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }
  };

  return (
    <section id="projects" className="relative min-h-screen py-24 px-6 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#D4AF37]/15">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F7F5F0] tracking-tight uppercase">
            Our Projects
          </h2>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {PROJECTS_DATA.map((proj, idx) => {
            const isSelected = activeProjectIndex === idx;
            return (
              <button
                key={proj.id}
                id={`project-tab-${proj.id}`}
                onClick={() => {
                  onSelectProject(idx);
                  setActiveImageIndex(0);
                  setMainManual(false);
                }}
                className={`px-4 py-2.5 rounded-sm text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#121212] font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                    : 'bg-[#181818] text-[#9E978E] hover:text-[#F7F5F0] hover:bg-[#22201D] border border-[#2A2723]'
                }`}
              >
                <span>{proj.number}</span>
                <span className="font-sans font-medium">{proj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Project Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Architectural Project Info */}
        <div className="lg:col-span-5 space-y-6 animate-fadeIn">
          {/* Project Meta Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2A2723]">
            <span className="font-heading text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#D4AF37] to-[#8C6D2B]">
              {currentProject.number}
            </span>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                {currentProject.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#9E978E] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {currentProject.year}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#9E978E] tracking-widest uppercase font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentProject.location}</span>
            </div>

            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#F7F5F0] tracking-tight">
              {currentProject.name}
            </h3>
          </div>
        </div>

        {/* Right Side: Architectural Photography / Gallery Viewer */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden luxury-glass border border-[#D4AF37]/25 p-4 sm:p-6 space-y-4 shadow-2xl animate-fadeIn">
            {effectiveImages.length > 0 ? (
              <div className="space-y-4">
                {/* Main Large Image Container */}
                <div
                  className="relative aspect-[4/5] sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#0E0E0E] border border-[#D4AF37]/30 group shadow-[0_0_30px_rgba(0,0,0,0.6)]"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={effectiveImages[activeImageIndex]?.url}
                    alt={currentProject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] brightness-110 saturate-110 contrast-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Navigation Arrows (Desktop only — mobile uses swipe) */}
                  {effectiveImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMainManual(true);
                          handlePrevImage();
                        }}
                        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121212]/80 hover:bg-[#D4AF37] text-[#F7F5F0] hover:text-[#121212] border border-[#2A2723] hover:border-[#D4AF37] transition-all backdrop-blur-sm"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMainManual(true);
                          handleNextImage();
                        }}
                        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#121212]/80 hover:bg-[#D4AF37] text-[#F7F5F0] hover:text-[#121212] border border-[#2A2723] hover:border-[#D4AF37] transition-all backdrop-blur-sm"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Top Bar: Fullscreen Button */}
                  <div className="absolute top-4 right-4 pointer-events-none">
                    <button
                      type="button"
                      onClick={() => {
                        setFsManual(false);
                        setFullscreenImage(effectiveImages[activeImageIndex]?.url || null);
                      }}
                      className="pointer-events-auto p-2 rounded-lg bg-[#121212]/80 hover:bg-[#D4AF37] text-[#9E978E] hover:text-[#121212] border border-[#2A2723] hover:border-[#D4AF37] transition-colors"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Pagination Indicators */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {effectiveImages.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          setMainManual(true);
                          setActiveImageIndex(dotIdx);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeImageIndex === dotIdx
                            ? 'w-8 bg-[#D4AF37]'
                            : 'bg-[#2A2723] hover:bg-[#5E574E]'
                        }`}
                        aria-label={`View photo ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono text-[#7E776E]">
                    SHIV KAMAKSHI DEVELOPERS ARCHIVE
                  </span>
                </div>
              </div>
            ) : (
              /* Fallback view for projects without photo sets */
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#1E1D1A] to-[#121212] border border-[#D4AF37]/20 flex flex-col justify-between p-6">
                <div className="absolute inset-0 bg-blueprint-grid opacity-50 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-[#121212]/85 border border-[#D4AF37]/30 text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                    Architectural Blueprint
                  </span>
                  <span className="text-xs font-mono text-[#9E978E]">
                    Elev. View {currentProject.number}
                  </span>
                </div>

                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-20 h-20 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#D4AF37]/10 shadow-[0_0_30px_rgba(212,175,55,0.18)]">
                    <Building2 className="w-9 h-9 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-[#F7F5F0] uppercase tracking-wider">
                      {currentProject.name}
                    </h4>
                    <p className="text-xs text-[#9E978E] font-light max-w-xs mx-auto">
                      Commercial development blueprint and architectural specifications.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#7E776E] pt-3 border-t border-[#2A2723]">
                  <span>STATUS: IN PLANNING</span>
                  <span className="text-[#D4AF37]">SHIV KAMAKSHI DEV.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setFullscreenImage(null)}
          onTouchStart={handleFsTouchStart}
          onTouchEnd={handleFsTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 left-6 z-10 flex items-center gap-2 px-5 py-3 rounded-full bg-[#D4AF37] text-[#121212] border border-[#D4AF37] font-bold shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:bg-[#E8C75A] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Back</span>
          </button>
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-[#181818] border border-[#D4AF37]/30 text-[#F7F5F0] hover:bg-[#D4AF37] hover:text-[#121212] transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={effectiveImages[activeImageIndex]?.url || fullscreenImage}
            alt="Fullscreen view"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-lg border border-[#D4AF37]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
