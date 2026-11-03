import React from 'react';
import { ENGINEER_PROFILE } from '../data/portfolioData';
import { ArrowUp, GitBranch, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070d1a] border-t border-slate-800/80 py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Identity */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                Alex Chen
              </span>
              <span className="text-xs font-mono text-slate-500">·</span>
              <span className="text-xs font-mono text-sky-400">
                Principal Systems Architect
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Designed using the Obsidian Kinetic technical minimalism design specification.
            </p>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <a
              href={ENGINEER_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href={ENGINEER_PROFILE.arxiv}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              <span>arXiv Profile</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-sky-400 transition-colors"
            >
              PGP Verification
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors ml-2"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Alex Chen. All technical artifacts distributed under Apache-2.0 or MIT.
          </div>
          <div className="flex items-center gap-2">
            <span>WCAG AAA High Contrast Slate</span>
            <span>·</span>
            <span>Zero-Allocation Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
