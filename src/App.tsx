import React, { useState, useEffect } from 'react';
import { BuildingCanvas3D } from './components/BuildingCanvas3D';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { Footer } from './components/Footer';
import { PROJECTS_DATA } from './data/mockData';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [manualTierOverride, setManualTierOverride] = useState<
    'foundation' | 'podium' | 'midrise' | 'skyvillas' | 'crown' | null
  >(null);

  // Monitor window scroll with requestAnimationFrame throttling for smooth performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          if (totalHeight > 0) {
            const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
            setScrollProgress(progress);
          }

          // Robust Section Tracking based on actual DOM element positions
          const windowHeight = window.innerHeight;
          const srvElem = document.getElementById('contact-cta');
          const projElem = document.getElementById('projects');

          // If scrolled near bottom of page, always contact-cta
          if (currentScroll + windowHeight >= document.documentElement.scrollHeight - 60) {
            setActiveSection('contact-cta');
          } else if (srvElem && srvElem.getBoundingClientRect().top <= windowHeight * 0.42) {
            setActiveSection('contact-cta');
          } else if (projElem && projElem.getBoundingClientRect().top <= windowHeight * 0.42) {
            setActiveSection('projects');
          } else {
            setActiveSection('home');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'projects') {
      const projElem = document.getElementById('projects');
      if (projElem) {
        const top = projElem.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    } else if (sectionId === 'contact-cta') {
      const srvElem = document.getElementById('contact-cta');
      if (srvElem) {
        const top = srvElem.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  };

  const handleSelectProject = (index: number) => {
    setActiveProjectIndex(index);
    setManualTierOverride(PROJECTS_DATA[index]?.highlightTier || null);
  };

  // Determine active 3D highlight tier
  const currentHighlightTier =
    activeSection === 'projects'
      ? PROJECTS_DATA[activeProjectIndex]?.highlightTier || null
      : manualTierOverride || (scrollProgress < 0.15 ? 'foundation' : null);

  return (
    <div className="relative min-h-screen bg-[#121212] text-[#E5E1DA] selection:bg-[#D4AF37]/30 selection:text-[#F7F5F0]">
      {/* Background Architectural Blueprint Grid */}
      <div className="fixed inset-0 bg-blueprint-grid opacity-35 pointer-events-none z-0" />

      {/* Fixed 3D Three.js Architectural Building Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BuildingCanvas3D
          scrollProgress={scrollProgress}
          activeProjectTier={currentHighlightTier}
        />
      </div>

      {/* Contrast dimming overlay — pushes the 3D building back so text/images pop in front */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0A0A0B]/45" />

      {/* Primary Fixed Navbar (Strictly Home, Projects, Our Services) */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Scrollable Foreground Content */}
      <main className="relative z-10">
        {/* 1. Hero / Home Section */}
        <HeroSection
          onExploreProjects={() => handleNavigate('projects')}
          onExploreServices={() => handleNavigate('contact-cta')}
        />

        {/* 2. Projects Section */}
        <ProjectsSection
          activeProjectIndex={activeProjectIndex}
          onSelectProject={handleSelectProject}
        />

        {/* 3. Our Services / Connect Section */}
        <ServicesSection />

        {/* 4. Minimal Footer */}
        <Footer />
      </main>
    </div>
  );
}
