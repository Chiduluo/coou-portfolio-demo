import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-2 mb-12">
        <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Industry Experience & Engineering Leadership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
          Systems Track Record & Architectural Impact
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Directing distributed storage and high-throughput consensus infrastructure supporting global
          scale workloads, fault tolerance invariants, and kernel-space optimizations.
        </p>
      </div>

      {/* Experience Timeline Grid */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-slate-800/80">
        {EXPERIENCES.map((exp, idx) => (
          <div key={exp.id} className="relative pl-8 sm:pl-12 group">
            {/* Timeline node marker */}
            <div className="absolute left-1.5 sm:left-3.5 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 transition-transform" />

            <div className="kinetic-card rounded-2xl p-6 sm:p-8 space-y-4">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[#f8fafc]">{exp.role}</h3>
                  <div className="text-sm font-semibold text-sky-400 mt-0.5">
                    {exp.organization}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.period}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {exp.description}
              </p>

              {/* Impact Metrics */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                  Measured Systems Impact
                </div>
                <div className="space-y-1.5">
                  {exp.impactMetrics.map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className="text-xs font-mono text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authored RFCs if present */}
              {exp.rfcsAuthored && exp.rfcsAuthored.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>RFCs:</span>
                  </span>
                  {exp.rfcsAuthored.map((rfc, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-500/30 text-blue-300"
                    >
                      {rfc}
                    </span>
                  ))}
                </div>
              )}

              {/* Tech Stack Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-lg bg-[rgba(15,23,42,0.8)] border border-slate-800 text-[11px] font-mono text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
