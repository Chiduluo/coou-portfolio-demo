import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, CornerDownLeft, Sparkles } from 'lucide-react';
import { ENGINEER_PROFILE, PROJECTS, PUBLICATIONS } from '../data/portfolioData';

interface TerminalConsoleProps {
  onOpenCaseStudy: (projectId: string) => void;
}

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ onOpenCaseStudy }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'uname -a && cargo --version',
      output: (
        <span className="text-slate-300">
          Linux node-42 6.12.0-systems-x86_64 #1 SMP PREEMPT_DYNAMIC GNU/Linux
          <br />
          cargo 1.84.0 (nightly 2026-10-15)
        </span>
      ),
    },
    {
      command: 'help',
      output: (
        <div className="space-y-1 text-slate-300">
          <div>Available commands:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sky-400">
            <div><span className="text-white font-bold">ls</span> - List all systems engineering artifacts</div>
            <div><span className="text-white font-bold">cat resume</span> - Print full systems CV & RFC list</div>
            <div><span className="text-white font-bold">cat bio</span> - Display engineering background</div>
            <div><span className="text-white font-bold">benchmarks</span> - Inspect benchmark summary</div>
            <div><span className="text-white font-bold">pubs</span> - View peer-reviewed publications</div>
            <div><span className="text-white font-bold">specs</span> - Print cluster bare-metal specs</div>
            <div><span className="text-white font-bold">pgp</span> - View public PGP encryption key</div>
            <div><span className="text-white font-bold">clear</span> - Clear terminal screen</div>
          </div>
        </div>
      ),
    },
  ]);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCopyLogs = () => {
    const text = history
      .map((h) => `$ ${h.command}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    let resultNode: React.ReactNode = null;

    if (lower === 'clear') {
      setHistory([]);
      return;
    } else if (lower === 'help') {
      resultNode = (
        <div className="space-y-1 text-slate-300">
          <div>Obsidian Kinetic CLI Commands:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sky-400">
            <div><span className="text-white font-bold">ls</span> - List projects and crates</div>
            <div><span className="text-white font-bold">cat resume</span> - Print systems engineering resume</div>
            <div><span className="text-white font-bold">cat bio</span> - Display engineering persona</div>
            <div><span className="text-white font-bold">benchmarks</span> - Inspect system latency benchmarks</div>
            <div><span className="text-white font-bold">pubs</span> - View research publications</div>
            <div><span className="text-white font-bold">specs</span> - Show lab hardware specs</div>
            <div><span className="text-white font-bold">pgp</span> - Show PGP public key</div>
            <div><span className="text-white font-bold">clear</span> - Clear output</div>
          </div>
        </div>
      );
    } else if (lower === 'ls' || lower === 'ls -la') {
      resultNode = (
        <div className="space-y-1">
          <div className="text-slate-400">drwxr-xr-x  alex  staff  4096 Oct 24 .</div>
          {PROJECTS.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">{p.id}/</span>
              <span className="text-slate-400">[{p.category}]</span>
              <span className="text-slate-300">{p.tagline}</span>
            </div>
          ))}
        </div>
      );
    } else if (lower === 'cat resume' || lower === 'resume') {
      resultNode = (
        <div className="space-y-2 text-slate-300">
          <div className="text-sky-400 font-bold text-sm">
            Alex Chen — Principal Systems Architect & Researcher
          </div>
          <div>Focus: Distributed Systems, LSM-Tree Storage Engines, io_uring, eBPF</div>
          <div className="text-slate-400">
            • Principal Systems Architect @ Helios Distributed Systems (2023 - Present)
            <br />
            • Staff Systems Software Engineer @ NovaCloud Infrastructure (2021 - 2023)
            <br />
            • Systems Research Fellow @ MIT CSAIL (2019 - 2021)
          </div>
          <div className="text-emerald-400 text-xs">
            RFCs Authored: RFC-014 (Deterministic Epoch Quorum Leases), RFC-029 (SIMD Bloom Probing)
          </div>
        </div>
      );
    } else if (lower === 'cat bio' || lower === 'bio' || lower === 'whoami') {
      resultNode = (
        <div className="text-slate-300 space-y-1">
          <div className="text-white font-semibold">{ENGINEER_PROFILE.name}</div>
          <div>{ENGINEER_PROFILE.title}</div>
          <div className="text-slate-400">{ENGINEER_PROFILE.bio}</div>
        </div>
      );
    } else if (lower === 'pubs' || lower === 'cat pubs') {
      resultNode = (
        <div className="space-y-2">
          {PUBLICATIONS.map((pub) => (
            <div key={pub.id} className="space-y-0.5 border-b border-slate-800/60 pb-1.5">
              <div className="text-sky-300 font-bold">{pub.title}</div>
              <div className="text-slate-400 text-[11px]">{pub.venue} ({pub.year})</div>
            </div>
          ))}
        </div>
      );
    } else if (lower === 'specs' || lower === 'lscpu') {
      resultNode = (
        <div className="text-slate-300 font-mono text-xs space-y-1">
          <div>Model name: AMD EPYC 9654 96-Core Processor (192 threads)</div>
          <div>L1d cache: 3 MiB | L2 cache: 96 MiB | L3 cache: 384 MiB</div>
          <div>Memory: 512 GiB DDR5-4800 ECC Registered</div>
          <div>Storage: 4x Samsung PM1733 3.84TB PCIe Gen4 NVMe (Direct I/O)</div>
          <div>Network: Dual Mellanox ConnectX-6 100GbE (RoCEv2 / kernel bypass)</div>
        </div>
      );
    } else if (lower === 'pgp' || lower === 'gpg') {
      resultNode = (
        <pre className="text-xs text-sky-300/90 bg-[#060c18] p-3 rounded border border-slate-800 overflow-x-auto">
          {ENGINEER_PROFILE.pgpKey}
        </pre>
      );
    } else if (lower === 'benchmarks') {
      resultNode = (
        <div className="space-y-1 text-slate-300">
          <div>Summary of Hardware Benchmarks:</div>
          <div>• KuroStore Write Throughput: 3.8M ops/sec (p99: 410 µs)</div>
          <div>• Nexus-RPC Intra-Rack Latency: 14 µs (FlatBuffers zero-copy)</div>
          <div>• NetPulse eBPF Ingress: 38.2M packets/sec (40Gbps wire speed)</div>
          <div>• RingBuffer Concurrency: 11.8M ops/sec (128 threads contending)</div>
        </div>
      );
    } else {
      resultNode = (
        <div className="text-red-400">
          Command not recognized: &quot;{cmd}&quot;. Type <span className="text-white font-bold">help</span> for a list of available system commands.
        </div>
      );
    }

    setHistory((prev) => [...prev, { command: trimmed, output: resultNode }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  return (
    <section id="terminal" className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="space-y-2 mb-10">
        <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Shell Environment</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
          System Console & Artifact Explorer
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Query systems metadata, inspect published RFCs, execute hardware diagnostic scripts, or
          retrieve PGP verification keys directly from the terminal prompt.
        </p>
      </div>

      {/* Terminal Window Box */}
      <div className="bg-[#0b1120] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 hover:border-slate-700">
        {/* Terminal Header */}
        <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/40" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/40" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              alex@node-42:~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors text-xs font-mono flex items-center gap-1"
              title="Copy session commands"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Session</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          className="p-5 sm:p-6 font-mono text-xs sm:text-sm min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 bg-[#080e1b] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <span className="text-slate-500">alex@node-42:~$</span>
                <span>{item.command}</span>
              </div>
              <div className="pl-4 border-l border-slate-800/80">{item.output}</div>
            </div>
          ))}

          {/* Prompt line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sky-400 pt-1">
            <span className="text-slate-500 whitespace-nowrap">alex@node-42:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type 'help' or 'cat resume'..."
              className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-600"
              autoFocus
            />
            <button type="submit" className="text-slate-500 hover:text-sky-400 p-1">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          <div ref={bottomRef} />
        </div>

        {/* Quick Command Suggestion Chips */}
        <div className="bg-[#0c1426] px-4 py-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="text-slate-500">Quick run:</span>
          {['help', 'ls', 'cat resume', 'benchmarks', 'specs', 'pgp'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-sky-300 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
