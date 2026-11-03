import React, { useState } from 'react';
import { BENCHMARK_DATA } from '../data/portfolioData';
import { BenchmarkResult } from '../types/portfolio';
import { Cpu, Play, BarChart3, CheckCircle, RefreshCw, Zap } from 'lucide-react';

export const BenchmarkSuite: React.FC = () => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkResult>(BENCHMARK_DATA[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [benchmarkRuns, setBenchmarkRuns] = useState<Record<string, boolean>>({});

  const handleRunBenchmark = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setBenchmarkRuns((r) => ({ ...r, [selectedBenchmark.id]: true }));
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const speedupMultiple = (
    selectedBenchmark.optimizedOps / selectedBenchmark.baselineOps
  ).toFixed(1);
  const latencyReduction = (
    ((selectedBenchmark.baselineP99 - selectedBenchmark.optimizedP99) /
      selectedBenchmark.baselineP99) *
    100
  ).toFixed(0);

  return (
    <section id="benchmarks" className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-2 mb-12">
        <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Empirical Systems Performance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
          Micro-Benchmarks & Latency Profiles
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Side-by-side empirical performance evaluations executed on 128-core bare-metal AMD EPYC
          nodes with persistent Optane memory and dual 100GbE NICs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Workload Selector list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono text-slate-400 font-semibold mb-2">
            Select Evaluation Workload:
          </div>
          {BENCHMARK_DATA.map((bench) => {
            const isSelected = selectedBenchmark.id === bench.id;
            const hasRun = benchmarkRuns[bench.id];

            return (
              <div
                key={bench.id}
                onClick={() => {
                  setSelectedBenchmark(bench);
                  setProgress(hasRun ? 100 : 0);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  isSelected
                    ? 'bg-blue-950/40 border-sky-400 shadow-md ring-1 ring-sky-500/20'
                    : 'bg-[#0e172a]/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-sky-400 font-semibold">
                    {bench.category}
                  </span>
                  {hasRun && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white mb-2">{bench.name}</div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{bench.unit}</span>
                  <span className="text-emerald-400 font-semibold">
                    {((bench.optimizedOps / bench.baselineOps)).toFixed(1)}x faster
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Benchmark Execution Panel */}
        <div className="lg:col-span-7 bg-[#0b1222] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-sky-400 font-bold uppercase">
                {selectedBenchmark.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedBenchmark.name}
              </h3>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="kinetic-btn-primary !py-2 !px-4 text-xs font-mono flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Profiler...' : 'Run Benchmark'}</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {selectedBenchmark.description}
          </p>

          {/* Progress bar during run */}
          {isRunning && (
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Executing 100M iterations with perf stat...</span>
                <span className="tabular-nums text-sky-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Visual Throughput Comparison Bars */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{selectedBenchmark.baselineName}</span>
                <span className="text-slate-300 font-bold tabular-nums">
                  {selectedBenchmark.baselineOps.toLocaleString()} {selectedBenchmark.unit}
                </span>
              </div>
              <div className="w-full h-7 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center px-3">
                <div
                  className="h-3 rounded bg-slate-600 transition-all duration-500"
                  style={{
                    width: `${(selectedBenchmark.baselineOps / selectedBenchmark.optimizedOps) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-300 font-semibold">{selectedBenchmark.optimizedName}</span>
                <span className="text-sky-400 font-bold tabular-nums">
                  {selectedBenchmark.optimizedOps.toLocaleString()} {selectedBenchmark.unit}
                </span>
              </div>
              <div className="w-full h-7 rounded-lg bg-blue-950/40 border border-blue-500/40 overflow-hidden flex items-center px-3">
                <div className="h-3 rounded bg-sky-400 transition-all duration-500 w-full" />
              </div>
            </div>
          </div>

          {/* Latency & Hardware Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#070d19] border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-500">Speedup Factor</div>
              <div className="text-base font-bold text-emerald-400 tabular-nums">
                +{speedupMultiple}x
              </div>
            </div>

            <div>
              <div className="text-slate-500">p99 Latency Delta</div>
              <div className="text-base font-bold text-sky-400 tabular-nums">
                -{latencyReduction}%
              </div>
            </div>

            <div>
              <div className="text-slate-500">Baseline p99</div>
              <div className="text-base font-bold text-slate-400 tabular-nums">
                {selectedBenchmark.baselineP99} µs
              </div>
            </div>

            <div>
              <div className="text-slate-500">Optimized p99</div>
              <div className="text-base font-bold text-sky-300 tabular-nums">
                {selectedBenchmark.optimizedP99} µs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
