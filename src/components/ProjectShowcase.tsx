import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectCategory, ProjectItem } from '../types/portfolio';
import { ArrowUpRight, GitFork, Star, Code2, Server, Terminal, ShieldAlert, Cpu } from 'lucide-react';

interface ProjectShowcaseProps {
  onOpenCaseStudy: (projectId: string) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenCaseStudy }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'storage', label: 'Storage Engines' },
    { id: 'distributed', label: 'Distributed Systems' },
    { id: 'runtimes', label: 'Compilers & JIT' },
    { id: 'ebpf', label: 'Kernel & eBPF' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          {/* Zero-pill kicker */}
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <span>Engineering Artifacts</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span>Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
            Production Engines & Distributed Runtimes
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Open-source systems, consensus protocols, and low-latency runtimes engineered with
            strict performance invariants, zero-allocation memory models, and formal safety proofs.
          </p>
        </div>

        {/* Filter Segmented Control (Functional Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Matrix / Bento Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          return (
            <div
              key={project.id}
              className="kinetic-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group cursor-pointer"
              onClick={() => onOpenCaseStudy(project.id)}
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-sky-400 font-semibold">{project.categoryLabel}</span>
                  <div className="flex items-center gap-3">
                    {project.stars && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="tabular-nums">{project.stars.toLocaleString()}</span>
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    <span>{project.license}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#f8fafc] group-hover:text-sky-300 transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>

                <p className="text-xs text-sky-400/90 font-mono font-medium">
                  {project.tagline}
                </p>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>

              {/* Card Metrics & Tech Stack Footer */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
                {/* 2-column key metrics */}
                <div className="grid grid-cols-2 gap-3 py-1">
                  {project.metrics.slice(0, 2).map((metric, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-[11px] text-slate-400">{metric.label}</div>
                      <div className="text-sm font-bold font-mono text-[#f8fafc] tabular-nums">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech stack chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-lg bg-[rgba(15,23,42,0.8)] border border-slate-800 text-[11px] font-mono text-slate-400 group-hover:border-sky-400/30 group-hover:text-slate-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA text */}
                <div className="text-xs font-mono text-sky-400 flex items-center gap-1.5 pt-1 group-hover:underline">
                  <span>Inspect Architecture & Benchmark</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
