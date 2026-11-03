import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Code, HardDrive, Terminal, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PROJECTS, PUBLICATIONS } from '../data/portfolioData';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenCaseStudy: (projectId: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCaseStudy,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredPubs = PUBLICATIONS.filter(
    (pub) =>
      pub.title.toLowerCase().includes(query.toLowerCase()) ||
      pub.venue.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#121c32]">
          <Search className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, benchmarks, papers, consensus architectures..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-4">
          {/* Quick Navigation Targets */}
          <div>
            <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'architecture', label: 'Systems Sandbox & Visualizer', icon: Layers },
                { id: 'projects', label: 'Production Engines & Artifacts', icon: Code },
                { id: 'benchmarks', label: 'Micro-Benchmarks & Latency', icon: HardDrive },
                { id: 'terminal', label: 'Interactive Terminal Shell', icon: Terminal },
                { id: 'publications', label: 'Research Papers & BibTeX', icon: FileText },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-left text-xs font-mono text-slate-300 hover:bg-slate-800/80 hover:text-sky-300 transition-colors"
                >
                  <item.icon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Engineering Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onOpenCaseStudy(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-mono hover:bg-blue-950/40 border border-transparent hover:border-blue-500/30 transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-300 flex items-center gap-2">
                        <span>{p.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({p.categoryLabel})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-lg">
                        {p.tagline}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Publications Results */}
          {filteredPubs.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Research Papers ({filteredPubs.length})
              </div>
              <div className="space-y-1">
                {filteredPubs.map((pub) => (
                  <button
                    key={pub.id}
                    onClick={() => {
                      onNavigate('publications');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-mono hover:bg-slate-800/60 transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-sky-300 truncate max-w-md">
                        {pub.title}
                      </div>
                      <div className="text-[10px] text-sky-400">
                        {pub.venue} ({pub.year}) · {pub.citations} Citations
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#0a1120] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with mouse or tap ESC to close</span>
          <span className="text-sky-400">Obsidian Kinetic</span>
        </div>
      </div>
    </div>
  );
};
