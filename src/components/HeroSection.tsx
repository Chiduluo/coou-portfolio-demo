import React, { useState } from 'react';
import { Play, Copy, Check, Terminal, Shield, Cpu, Layers, GitBranch, ArrowRight, Download } from 'lucide-react';
import { ENGINEER_PROFILE } from '../data/portfolioData';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenCaseStudy: (projectId: string) => void;
}

const CODE_EXAMPLES = [
  {
    id: 'raft',
    label: 'raft_engine.rs',
    path: 'crates/consensus/src/raft_engine.rs',
    language: 'rust',
    code: `pub struct RaftEngine<S: StateMachine> {
    state: NodeState,
    current_term: AtomicU64,
    voted_for: Option<NodeId>,
    log: AppendLogRing<4096>,
    peers: Arc<PeerMesh>,
}

impl<S: StateMachine> RaftEngine<S> {
    #[inline(always)]
    pub async fn replicate_entry_zero_copy(
        &self,
        entry: &[u8],
    ) -> Result<Index, ConsensusError> {
        let term = self.current_term.load(Ordering::Acquire);
        let idx = self.log.append_batch_sqe(term, entry)?;
        
        // Broadcast AppendEntries RPC with non-blocking quorum wait
        let quorum = self.peers.broadcast_append_async(term, idx).await?;
        if quorum >= self.peers.majority() {
            self.commit_index.store(idx, Ordering::Release);
            return Ok(idx);
        }
        Err(ConsensusError::QuorumTimeout)
    }
}`,
  },
  {
    id: 'wal',
    label: 'io_uring_wal.rs',
    path: 'crates/storage/src/io_uring_wal.rs',
    language: 'rust',
    code: `pub struct AlignedWalWriter {
    ring: io_uring::IoUring,
    fd: RawFd,
    page_pool: MemoryPool<4096>,
}

impl AlignedWalWriter {
    pub fn commit_txn_barrier(&mut self, payload: &[u8]) -> IoResult<()> {
        let slot = self.page_pool.allocate_aligned_pinned()?;
        unsafe {
            std::ptr::copy_nonoverlapping(payload.as_ptr(), slot.as_mut_ptr(), payload.len());
            let write_sqe = opcode::Write::new(
                types::Fd(self.fd),
                slot.as_ptr(),
                payload.len() as u32
            ).build();
            self.ring.submission().push(&write_sqe)?;
        }
        self.ring.submit_and_wait(1)?;
        Ok(())
    }
}`,
  },
  {
    id: 'simd',
    label: 'simd_bloom.cpp',
    path: 'native/storage/simd_bloom.cpp',
    language: 'cpp',
    code: `bool SimdBloomFilter::probe_avx512(uint64_t hash) const noexcept {
    const __m512i hash_vec = _mm512_set1_epi64(hash);
    const __m512i salts = _mm512_loadu_si512(SALT_OFFSETS);
    const __m512i combined = _mm512_mullo_epi64(hash_vec, salts);
    
    // Vectorized bitmask check against 512-bit cacheline
    const __m512i bit_indices = _mm512_and_si512(combined, _mm512_set1_epi64(511));
    const __m512i filter_bits = _mm512_load_si512(bitset_ptr);
    
    return _mm512_test_epi64_mask(filter_bits, bit_indices) == 0xFF;
}`,
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenCaseStudy,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunExecution = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionLogs([]);

    const steps = [
      `[Init] Allocating pinned direct I/O memory pool (4096-byte aligned)...`,
      `[Cluster] Established 5-node mesh quorum (Term 142, Leader: Node 1)`,
      `[Raft] Broadcasting 10,000 zero-copy batch proposals via io_uring...`,
      `[Consensus] Quorum reached across 5/5 nodes in 348 µs (0 byte allocation)`,
      `[Result] Verified serializable commit index: #1,849,200 | Throughput: 4.12M ops/s`,
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setIsExecuting(false);
        }
      }, (index + 1) * 350);
    });
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background kinetic ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-sky-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split-Screen Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Zero-Pill Unboxed Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 tracking-wide uppercase">
              <span>Distributed Systems</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>Storage Engines</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>Kernel eBPF</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>Zero-Copy Runtimes</span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#f8fafc] leading-[1.12] tracking-tight text-balance">
              Architecting Resilient Distributed Systems at Scale.
            </h1>

            {/* Body Prose */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              I design and implement deterministic consensus protocols, high-throughput LSM-Tree
              storage engines, and microsecond-tier kernel-bypass network runtimes. Focused on formal
              correctness, lock-free concurrency, and hardware-conscious zero-allocation hot paths.
            </p>

            {/* Actions: Primary & Secondary Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('projects')}
                className="kinetic-btn-primary flex items-center gap-2"
              >
                <span>Inspect Artifacts</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('architecture')}
                className="kinetic-btn-secondary flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Architecture Visualizer</span>
              </button>
            </div>

            {/* Social & Academic Trust Identifiers */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
              <a
                href={ENGINEER_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>github.com/alexchen-systems</span>
              </a>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <a
                href={ENGINEER_PROFILE.arxiv}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
              >
                <span>arXiv:chen_a_4</span>
              </a>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>PGP: 8F2A 4C19 90E1 BD45</span>
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Interactive Live Code Block / Terminal */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="w-full bg-[#0b1120] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group transition-all duration-300 hover:border-sky-500/40">
              {/* Header Bar with simulated window controls and file path label */}
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/40" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/40" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline truncate max-w-[200px]">
                    {CODE_EXAMPLES[activeTab].path}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={handleRunExecution}
                    disabled={isExecuting}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 ${isExecuting ? 'animate-spin' : ''}`} />
                    <span>{isExecuting ? 'Running...' : 'Execute'}</span>
                  </button>
                </div>
              </div>

              {/* Code File Tabs */}
              <div className="flex items-center border-b border-slate-800/80 bg-[#0c1427] px-2 overflow-x-auto">
                {CODE_EXAMPLES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(idx);
                      setExecutionLogs([]);
                    }}
                    className={`px-3 py-2 text-xs font-mono whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === idx
                        ? 'border-sky-400 text-sky-400 bg-slate-900/40 font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Code Content View */}
              <div className="p-4 overflow-x-auto max-h-[300px] text-xs font-mono leading-relaxed bg-[#0b1120] text-slate-200">
                <pre className="selection:bg-blue-900/50">
                  <code>{CODE_EXAMPLES[activeTab].code}</code>
                </pre>
              </div>

              {/* Real-time Interactive Execution Console Terminal */}
              <div className="bg-[#070d18] border-t border-slate-800/80 p-3.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 mb-2 pb-1 border-b border-slate-800/50">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-sky-400" />
                    <span className="font-semibold text-slate-300">Live Consensus Execution Console</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Node-Mesh v2.4</span>
                </div>

                {executionLogs.length === 0 ? (
                  <div className="text-slate-500 italic py-1 flex items-center justify-between">
                    <span>Ready for execution. Click [Execute] to benchmark live quorum consensus.</span>
                    <button
                      onClick={handleRunExecution}
                      className="text-sky-400 hover:underline not-italic text-[10px]"
                    >
                      Run Now →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {executionLogs.map((log, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-200 ${
                          log.includes('Result')
                            ? 'text-emerald-400 font-semibold'
                            : log.includes('Consensus')
                            ? 'text-sky-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metric Strip below the split */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] font-mono tabular-nums tracking-tight">
              99.999%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Service SLA under Partition
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums tracking-tight">
              &lt;840 µs
            </div>
            <div className="text-xs text-slate-400 font-medium">
              p99 Consensus Latency
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] font-mono tabular-nums tracking-tight">
              12.4M ops/s
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Peak Log Ingestion Rate
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums tracking-tight">
              0 byte
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Hot-Path Allocations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
