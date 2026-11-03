import React, { useState, useEffect } from 'react';
import { Terminal, Search, ExternalLink, Menu, X, ArrowUpRight } from 'lucide-react';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'projects', label: 'Artifacts' },
    { id: 'benchmarks', label: 'Benchmarks' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'publications', label: 'Publications' },
    { id: 'experience', label: 'Experience' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0b1326]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, clean display text) */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left group flex items-center gap-2.5 shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:border-sky-400/80 group-hover:text-sky-300 transition-colors">
            <span className="font-mono text-xs font-bold tracking-wider">OK</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-sky-400 transition-colors whitespace-nowrap">
              Alex Chen
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 hover:text-slate-100 ${
                  isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Command Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors"
            title="Open Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className="kinetic-btn-primary !py-2 !px-4 text-xs tracking-wide uppercase flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e172a] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-sky-400 hover:bg-slate-800/40 rounded-lg transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Command Palette (⌘K)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
