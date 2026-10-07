import React from 'react';
import { CORE_SERVICES } from '../data/mockData';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative min-h-screen py-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-24 scroll-mt-20"
    >
      {/* CTA Block */}
      <div id="contact-cta" className="max-w-3xl mx-auto text-center space-y-6">
        <div className="space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F7F5F0] tracking-tight">
            Have a project in mind?
          </h2>
          <p className="text-base sm:text-lg text-[#B9B3A9] font-light leading-relaxed">
            Let&apos;s discuss your next project.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/910000000000?text=Hello%20Shiv%20Kamakshi%20Developers%2C%20I%20would%20like%20to%20inquire%20about%20your%20architectural%20developments."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#25D366] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#20BD5B] hover:shadow-[0_0_24px_rgba(37,211,102,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>

          <a
            href="tel:+910000000000"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#181818]/90 text-[#E5E1DA] text-xs font-medium uppercase tracking-[0.2em] border border-[#D4AF37]/30 transition-all duration-300 hover:bg-[#24221F] hover:border-[#D4AF37]/60 hover:text-[#F7F5F0] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Phone className="w-4 h-4" />
            <span>Call Us</span>
          </a>

          <a
            href="mailto:inquiries@shivkamakshidevelopers.demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#181818]/90 text-[#E5E1DA] text-xs font-medium uppercase tracking-[0.2em] border border-[#D4AF37]/30 transition-all duration-300 hover:bg-[#24221F] hover:border-[#D4AF37]/60 hover:text-[#F7F5F0] backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us</span>
          </a>
        </div>
      </div>

      {/* CORE SERVICES MATRIX */}
      <div className="space-y-6 pt-6">
        <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#F7F5F0] pb-2 border-b border-[#2A2723]">
          Core Architectural Competencies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#161616]/80 border border-[#2A2723] hover:border-[#D4AF37]/45 transition-all duration-300 space-y-4 luxury-glass-hover"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D4AF37]">0{idx + 1}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#1C1C1C] text-[#9E978E]">
                  {srv.tag}
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#F7F5F0] leading-snug">
                {srv.title}
              </h4>

              <p className="text-xs text-[#A9A49B] font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
