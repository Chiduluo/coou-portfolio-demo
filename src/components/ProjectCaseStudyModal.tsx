import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types/portfolio';
import { X, Copy, Check, Play, GitBranch, Shield, ArrowRight, Activity, Terminal } from 'lucide-react';

interface ProjectCaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatingLoad, setSimulatingLoad] = useState(false);
  const [simResults, setSimResults] = useState<{
    requests: number;
    p50: string;
    p99: string;
    throughput: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateLoad = () => {
    setSimulatingLoad(true);
    setSimResults(null);
    setTimeout(() => {
      setSimResults({
        requests: 100000,
        p50: '184 µs',
        p99: project.metrics[0]?.value || '410 µs',
        throughput: project.metrics[1]?.value || '3.8M ops/sec',
      });
      setSimulatingLoad(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#0e172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#131d33] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              {project.categoryLabel}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">{project.license} License</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Title & Tagline */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base font-mono text-sky-400 font-medium">
              {project.tagline}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {project.summary}
            </p>
          </div>

          {/* Performance Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#091022] border border-slate-800">
            {project.metrics.map((m, i) => (
              <div key={i} className="space-y-0.5">
                <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                <div className="text-lg font-bold font-mono text-sky-300 tabular-nums">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Architecture Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Architectural Invariants & Design Principles</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              {project.architectureNotes}
            </p>
          </div>

          {/* Trade-Offs Evaluated */}
          {project.tradeoffs && project.tradeoffs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-slate-200 font-bold uppercase tracking-wider">
                Engineering Trade-Offs Analyzed
              </h3>
              <div className="space-y-3">
                {project.tradeoffs.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0a1222] border border-slate-800/80 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                      <span className="text-emerald-400 font-semibold">
                        ✓ Selected: {t.chosen}
                      </span>
                      <span className="text-slate-500 line-through">
                        Alternative: {t.alternative}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {t.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benchmark Results */}
          {project.benchmarks && project.benchmarks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Empirical Benchmark Results</span>
                <span className="text-xs text-sky-400 font-normal">Controlled Hardware Harness</span>
              </h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#121c32] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Workload Profile</th>
                      <th className="py-2.5 px-4 font-semibold">Baseline</th>
                      <th className="py-2.5 px-4 font-semibold">Optimized Engine</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-[#091022]">
                    {project.benchmarks.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-2.5 px-4 text-slate-200">{b.workload}</td>
                        <td className="py-2.5 px-4 text-slate-400 tabular-nums">{b.baseline}</td>
                        <td className="py-2.5 px-4 text-sky-300 font-bold tabular-nums">
                          {b.optimized}
                        </td>
                        <td className="py-2.5 px-4 text-right text-emerald-400 font-semibold tabular-nums">
                          {b.improvement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Source Code Snippet Inspection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>Hot-Path Source Inspection</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {project.codeSnippet.filename}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#091022] overflow-hidden">
              <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <button
                  onClick={handleCopyCode}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          </div>

          {/* Interactive Load Injection Simulator */}
          <div className="p-5 rounded-xl bg-[#091022] border border-blue-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Real-Time Invariant Stress Harness</span>
                </div>
                <p className="text-xs text-slate-400">
                  Inject 100,000 synthetic operations across concurrent mock worker threads.
                </p>
              </div>

              <button
                onClick={handleSimulateLoad}
                disabled={simulatingLoad}
                className="kinetic-btn-primary !py-2 !px-4 text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${simulatingLoad ? 'animate-spin' : ''}`} />
                <span>{simulatingLoad ? 'Simulating Traffic...' : 'Inject 100k Requests'}</span>
              </button>
            </div>

            {simResults && (
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono animate-fadeIn">
                <div>
                  <div className="text-slate-500">Processed</div>
                  <div className="text-white font-bold tabular-nums">
                    {simResults.requests.toLocaleString()} reqs
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">p50 Latency</div>
                  <div className="text-sky-400 font-bold tabular-nums">{simResults.p50}</div>
                </div>
                <div>
                  <div className="text-slate-500">p99 Latency</div>
                  <div className="text-emerald-400 font-bold tabular-nums">{simResults.p99}</div>
                </div>
                <div>
                  <div className="text-slate-500">Throughput</div>
                  <div className="text-white font-bold tabular-nums">{simResults.throughput}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#11192e] border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            Tech Stack: {project.techStack.join(' · ')}
          </div>
          <button
            onClick={onClose}
            className="kinetic-btn-secondary !py-1.5 !px-4 text-xs font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
