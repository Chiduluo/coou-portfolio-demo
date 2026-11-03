import React, { useState } from 'react';
import { PUBLICATIONS } from '../data/portfolioData';
import { Publication } from '../types/portfolio';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp, FileText, ExternalLink, Quote } from 'lucide-react';

export const PublicationsSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(PUBLICATIONS[0].id);
  const [bibtexModalPub, setBibtexModalPub] = useState<Publication | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="publications" className="py-24 bg-[#091022] border-t border-b border-slate-800/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Research & Publications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
            Peer-Reviewed Distributed Systems Papers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            First-author research in fault-tolerant consensus, non-volatile memory storage architectures,
            and line-rate programmable kernel telemetry.
          </p>
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {PUBLICATIONS.map((pub) => {
            const isExpanded = expandedId === pub.id;

            return (
              <div
                key={pub.id}
                className="kinetic-card rounded-2xl p-6 sm:p-8 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    {/* Unboxed metadata kicker */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400">
                      <span className="font-semibold">{pub.venue}</span>
                      <span className="text-slate-600">·</span>
                      <span>{pub.year}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-300 font-bold">{pub.citations} Citations</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500 font-mono">DOI: {pub.doi}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#f8fafc] leading-snug">
                      {pub.title}
                    </h3>

                    {/* Authors list */}
                    <div className="text-xs sm:text-sm text-slate-400 font-medium">
                      {pub.authors.map((author, i) => (
                        <span key={i}>
                          <span className={author.includes('Alex Chen') ? 'text-sky-300 font-semibold' : ''}>
                            {author}
                          </span>
                          {i < pub.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: BibTeX & PDF */}
                  <div className="flex items-center gap-2.5 shrink-0 self-start">
                    <button
                      onClick={() => setBibtexModalPub(pub)}
                      className="kinetic-btn-secondary !py-2 !px-3 text-xs font-mono flex items-center gap-1.5"
                    >
                      <Quote className="w-3.5 h-3.5 text-sky-400" />
                      <span>BibTeX</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      aria-label="Toggle abstract"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                        Paper Abstract
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed bg-[#070d19] p-4 rounded-xl border border-slate-800/60 font-sans">
                        {pub.abstract}
                      </p>
                    </div>

                    {/* Research Takeaways */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                        Key Architectural Contributions
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pub.highlights.map((hl, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 font-mono"
                          >
                            <span className="text-sky-400 font-bold mr-1.5">0{idx + 1}.</span>
                            {hl}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BibTeX Modal */}
      {bibtexModalPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0e172a] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-mono font-bold text-white">BibTeX Citation</div>
              <button
                onClick={() => setBibtexModalPub(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#070d19] border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
              {bibtexModalPub.bibtex}
            </pre>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopyBibtex(bibtexModalPub.bibtex)}
                className="kinetic-btn-primary !py-2 !px-4 text-xs font-mono flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
