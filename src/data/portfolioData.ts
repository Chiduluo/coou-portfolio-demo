import { ProjectItem, Publication, ExperienceItem, BenchmarkResult } from '../types/portfolio';

export const ENGINEER_PROFILE = {
  name: 'Alex Chen',
  title: 'Principal Systems Architect & CS Researcher',
  focus: 'Distributed Consensus · Storage Engines · Kernel eBPF · Zero-Copy Runtimes',
  bio: 'Specializing in deterministic distributed protocols, high-throughput LSM-Tree storage engines, and low-latency systems infrastructure. Core contributor to open-source distributed runtimes and author of multiple peer-reviewed papers on fault-tolerant systems.',
  location: 'San Francisco, CA & Zurich, Switzerland',
  email: 'alex.chen.systems@gmail.com',
  github: 'https://github.com/alexchen-systems',
  arxiv: 'https://arxiv.org/a/chen_a_4',
  orcid: '0000-0002-8914-3829',
  pgpKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.1.0
Comment: https://openpgpjs.org

xsBNBGA+29sBCAC5...89XqK7mP
Alex Chen (Systems Architecture) <alex.chen.systems@gmail.com>
Fingerprint: 8F2A 4C19 90E1 BD45 61A2 77F0 3B9E A012 4589 DE3F
-----END PGP PUBLIC KEY BLOCK-----`,
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'kurostore',
    title: 'KuroStore',
    tagline: 'Distributed Tiered LSM-Tree Engine with Multi-Raft Consensus',
    category: 'storage',
    categoryLabel: 'Storage Engine & Consensus',
    featured: true,
    summary: 'A high-performance embedded & distributed key-value storage engine engineered in Rust. Implements an append-only WAL, concurrent lock-free SkipList MemTable, SIMD-vectorized Bloom filter probing, and Multi-Raft state machine replication for horizontal sharding.',
    metrics: [
      { label: 'p99 Write Latency', value: '410 µs' },
      { label: 'Throughput', value: '3.8M ops/sec' },
      { label: 'Write Amplification', value: '2.4x (vs 8.1x)' },
      { label: 'Hot-Path Allocations', value: '0 bytes' },
    ],
    techStack: ['Rust', 'Multi-Raft', 'io_uring', 'AVX-512', 'LSM-Tree', 'gRPC'],
    stars: 3840,
    forks: 412,
    license: 'Apache-2.0',
    architectureNotes: 'KuroStore separates write-ahead logging from data persistence via Linux io_uring asynchronous submission rings. The compaction pipeline uses a leveled-compaction algorithm with concurrent merge-sort iterators that reuse pre-allocated page buffers to eliminate allocator fragmentation.',
    codeSnippet: {
      language: 'rust',
      filename: 'crates/kuro-engine/src/wal.rs',
      code: `pub struct WalWriter<R: RingSubmitter> {
    ring: R,
    aligned_buf: AlignedPageBuffer<4096>,
    current_offset: AtomicU64,
    sync_mode: SyncPolicy,
}

impl<R: RingSubmitter> WalWriter<R> {
    #[inline(always)]
    pub unsafe fn append_entry_zero_copy(
        &mut self,
        term: u64,
        index: u64,
        payload: &[u8],
    ) -> Result<WalWriteTicket, StorageError> {
        let entry_header = WalHeader::new(term, index, payload.len() as u32);
        let total_size = entry_header.total_aligned_len();
        
        // Direct pointer bump into pre-pinned direct I/O memory
        let dest = self.aligned_buf.reserve_slice(total_size)?;
        std::ptr::copy_nonoverlapping(
            &entry_header as *const _ as *const u8,
            dest.as_mut_ptr(),
            std::mem::size_of::<WalHeader>(),
        );
        std::ptr::copy_nonoverlapping(
            payload.as_ptr(),
            dest.as_mut_ptr().add(std::mem::size_of::<WalHeader>()),
            payload.len(),
        );
        
        self.ring.submit_write_sqe(self.current_offset.fetch_add(total_size as u64, Ordering::Release))
    }
}`,
    },
    tradeoffs: [
      {
        chosen: 'Multi-Raft Consensus Groups',
        alternative: 'Single Monolithic Raft Ring',
        reasoning: 'Multi-Raft shards the log into distinct partitions, allowing concurrent leader leases and preventing throughput bottlenecks under high core count servers.',
      },
      {
        chosen: 'Leveled Compaction with Dynamic Tiering',
        alternative: 'Size-Tiered Compaction',
        reasoning: 'Reduces point-lookup read amplification by guaranteeing at most 1 SSTable per key in Level 1+, bounding tail latency under strict 500µs budgets.',
      },
    ],
    benchmarks: [
      { workload: 'Random 1KB Put (100 Threads)', baseline: '1.1M ops/sec', optimized: '3.8M ops/sec', improvement: '+245%' },
      { workload: 'Point Read (Zipfian 0.99)', baseline: '820 µs p99', optimized: '410 µs p99', improvement: '2.0x faster' },
      { workload: 'Tail Compaction Pause', baseline: '45 ms', optimized: '1.2 ms', improvement: '97% reduction' },
    ],
  },
  {
    id: 'aether-vm',
    title: 'Aether-VM',
    tagline: 'Register-Based Trace-JIT Bytecode Runtime with SSA Optimizer',
    category: 'runtimes',
    categoryLabel: 'Compiler & JIT Runtime',
    featured: true,
    summary: 'A register-based virtual machine designed for dynamic dataflow graphing and low-latency scripting engines. Compiles hot traces into native ARM64 and x86-64 machine instructions using a linear-scan register allocator and copy-propagation passes.',
    metrics: [
      { label: 'JIT Warmup Time', value: '<2.1 ms' },
      { label: 'Bytecode Speedup', value: '8.4x (vs V8 Lite)' },
      { label: 'Binary Footprint', value: '480 KB' },
      { label: 'Native Targets', value: 'x86_64, aarch64' },
    ],
    techStack: ['C++20', 'LLVM-IR', 'SSA Form', 'Assembler', 'Linux', 'macOS'],
    stars: 2190,
    forks: 184,
    license: 'MIT',
    architectureNotes: 'Aether-VM avoids stack manipulation overhead by employing a 3-address register bytecode format. The trace recorder identifies loops exceeding execution thresholds and lowers intermediate representation directly to machine code in memory with hardware cache-flush primitives.',
    codeSnippet: {
      language: 'cpp',
      filename: 'src/jit/linear_allocator.cpp',
      code: `void LinearScanAllocator::allocateRegisters(TraceIR& trace) {
    std::sort(liveIntervals.begin(), liveIntervals.end(), 
              [](const LiveInterval& a, const LiveInterval& b) {
                  return a.start < b.start;
              });

    for (auto& current : liveIntervals) {
        expireOldIntervals(current.start);
        if (activeRegisters.size() == NUM_PHYSICAL_REGISTERS) {
            spillAtInterval(current);
        } else {
            Register reg = getAvailablePhysicalRegister();
            current.assignedRegister = reg;
            activeRegisters.insert(current);
            trace.patchRegister(current.virtualReg, reg);
        }
    }
}`,
    },
    tradeoffs: [
      {
        chosen: 'Register-Based 3-Address Code',
        alternative: 'Stack-Based Virtual Machine',
        reasoning: 'Reduces the total instruction count per function dispatch by 35% and simplifies SSA register mapping into native hardware registers.',
      },
    ],
    benchmarks: [
      { workload: 'Recursive Fibonacci (N=40)', baseline: '480 ms', optimized: '58 ms', improvement: '8.2x faster' },
      { workload: 'Matrix Vector Dot Product', baseline: '1.2 GB/s', optimized: '7.8 GB/s', improvement: '+550%' },
    ],
  },
  {
    id: 'netpulse-ebpf',
    title: 'NetPulse eBPF',
    tagline: 'Kernel-Space Wire-Speed Telemetry & Flow Invariant Verifier',
    category: 'ebpf',
    categoryLabel: 'Linux Kernel & eBPF',
    featured: true,
    summary: 'In-kernel network observability and stateful invariant enforcement framework powered by eBPF/XDP. Inspects raw packet headers at driver hook points, performing flow tracking, TCP RTT distribution profiling, and instant DDoS mitigation at 40Gbps wire speed without packet drops.',
    metrics: [
      { label: 'Packet Processing Rate', value: '38.2M pps' },
      { label: 'Overhead per Packet', value: '18 ns' },
      { label: 'Memory Invariance', value: 'Zero Drop' },
      { label: 'Kernel Hooks', value: 'XDP / TC / Tracepoints' },
    ],
    techStack: ['C', 'eBPF', 'XDP', 'Rust (User-space CLI)', 'BCC', 'Grafana'],
    stars: 1720,
    forks: 139,
    license: 'GPL-2.0-only',
    architectureNotes: 'NetPulse leverages BPF CO-RE (Compile Once – Run Everywhere) with BTF type debugging. In-kernel per-CPU hash maps accumulate flow records, pushing metric vectors into user-space through a ring buffer with batched wakeups.',
    codeSnippet: {
      language: 'c',
      filename: 'bpf/xdp_telemetry.bpf.c',
      code: `SEC("xdp")
int netpulse_ingress_probe(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data = (void *)(long)ctx->data;

    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;

    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return XDP_PASS;

    struct iphdr *iph = (void *)(eth + 1);
    if ((void *)(iph + 1) > data_end)
        return XDP_PASS;

    // Fast-path flow hash map lookup
    struct flow_key key = { .src_ip = iph->saddr, .dst_ip = iph->daddr, .proto = iph->protocol };
    struct flow_metrics *metric = bpf_map_lookup_elem(&flow_cache_map, &key);
    if (metric) {
        __sync_fetch_and_add(&metric->packet_count, 1);
        __sync_fetch_and_add(&metric->byte_count, iph->tot_len);
    }
    return XDP_PASS;
}`,
    },
    tradeoffs: [
      {
        chosen: 'XDP Driver Hook Point',
        alternative: 'Linux Socket Filter (AF_PACKET)',
        reasoning: 'XDP executes before the socket buffer (sk_buff) is allocated in the kernel networking stack, resulting in an 85% reduction in CPU cycles per packet.',
      },
    ],
    benchmarks: [
      { workload: 'SYN Flood Mitigation (40Gbps link)', baseline: '4.8M pps (CPU sat)', optimized: '38.2M pps (wire speed)', improvement: '8.0x throughput' },
      { workload: 'Flow RTT Profiling Latency', baseline: '140 ns/pkt', optimized: '18 ns/pkt', improvement: '87% reduction' },
    ],
  },
  {
    id: 'synapse-kv',
    title: 'SynapseKV',
    tagline: 'Lock-Free NVMe-Direct Key-Value Store with Hazard Pointers',
    category: 'storage',
    categoryLabel: 'Low-Latency Storage',
    featured: false,
    summary: 'A wait-free memory-mapped key-value store crafted for real-time telemetry caches. Utilizes user-space memory mapped files over SPDK NVMe drivers, atomic hazard pointers for memory reclamation, and non-blocking hash tables.',
    metrics: [
      { label: 'Read Latency (p999)', value: '82 µs' },
      { label: 'Concurrent Readers', value: '128 Cores Scalable' },
      { label: 'Crash Consistency', value: 'WAL + Flush Barriers' },
      { label: 'Zero Locks', value: 'Wait-free Reads' },
    ],
    techStack: ['Zig', 'SPDK', 'Hazard Pointers', 'NVMe', 'Atomic CAS'],
    stars: 1250,
    forks: 94,
    license: 'Apache-2.0',
    architectureNotes: 'Memory reclamation in multi-threaded lock-free data structures is notoriously difficult without garbage collection. SynapseKV implements wait-free Hazard Pointers with thread-local retirement epochs, preventing ABA bugs and memory leaks.',
    codeSnippet: {
      language: 'zig',
      filename: 'src/hazard_epoch.zig',
      code: `pub const HazardRecord = struct {
    hp: [2]?*anyopaque = [_]?*anyopaque{null} ** 2,
    next: ?*HazardRecord = null,
    active: std.atomic.Value(bool) = std.atomic.Value(bool).init(true),

    pub fn acquire(self: *HazardRecord, ptr: *anyopaque) void {
        self.hp[0] = ptr;
        @fence(.SeqCst);
    }

    pub fn release(self: *HazardRecord) void {
        self.hp[0] = null;
        @fence(.Release);
    }
};`,
    },
    tradeoffs: [
      {
        chosen: 'SPDK NVMe Direct Driver',
        alternative: 'POSIX mmap() syscalls',
        reasoning: 'Bypasses kernel context switches and page table locks completely, allowing direct polling queues to maintain consistent 82µs tail latencies.',
      },
    ],
    benchmarks: [
      { workload: 'Multi-Core Scalability (64 Cores)', baseline: '2.1M ops/s (lock contention)', optimized: '11.8M ops/s', improvement: '5.6x linear scale' },
    ],
  },
  {
    id: 'nexus-rpc',
    title: 'Nexus-RPC',
    tagline: 'Zero-Copy Multiplexed RPC Framework with Adaptive Congestion Flow',
    category: 'distributed',
    categoryLabel: 'Distributed Systems',
    featured: false,
    summary: 'A microsecond-tier RPC framework engineered for intra-datacenter service meshing. Employs a custom binary framing header, kernel bypass memory pools, and credit-based flow control to prevent head-of-line blocking.',
    metrics: [
      { label: 'Round-Trip Latency', value: '14 µs (LAN)' },
      { label: 'Throughput', value: '8.4M req/sec' },
      { label: 'Channel Multiplexing', value: '64k streams/conn' },
      { label: 'Deserialization Cost', value: '0 ns (View-Only)' },
    ],
    techStack: ['Rust', 'Tokio', 'FlatBuffers', 'QUIC/TCP', 'epoll'],
    stars: 1420,
    forks: 110,
    license: 'MIT',
    architectureNotes: 'Unlike traditional gRPC which relies on protobuf heap allocation on every message parse, Nexus-RPC guarantees that message fields are mapped directly to network receive buffers via FlatBuffers zero-copy layout.',
    codeSnippet: {
      language: 'rust',
      filename: 'src/multiplexer.rs',
      code: `pub struct StreamMux<T: AsyncRead + AsyncWrite> {
    transport: T,
    inbound_channels: DashMap<u32, mpsc::Sender<FramePayload>>,
    credit_allocator: AtomicU32,
}

impl<T: AsyncRead + AsyncWrite + Unpin> StreamMux<T> {
    pub async fn dispatch_frame(&self, frame: FrameHeader, payload: Bytes) -> Result<(), MuxError> {
        let stream_id = frame.stream_id();
        if let Some(chan) = self.inbound_channels.get(&stream_id) {
            chan.try_send(payload).map_err(|_| MuxError::BackpressureExceeded)?;
        }
        Ok(())
    }
}`,
    },
    tradeoffs: [
      {
        chosen: 'Zero-Copy FlatBuffers Binary Schema',
        alternative: 'Standard Protobuf / JSON-RPC',
        reasoning: 'Eliminates parsing loops entirely; payload fields are accessed via byte-offset pointer arithmetic without allocations.',
      },
    ],
    benchmarks: [
      { workload: 'Intra-Rack RPC Latency', baseline: '95 µs (gRPC default)', optimized: '14 µs (Nexus-RPC)', improvement: '6.7x lower latency' },
    ],
  },
  {
    id: 'aegis-verify',
    title: 'Aegis-Verify',
    tagline: 'TLA+ Model Checker & Invariant State Space Explorer',
    category: 'distributed',
    categoryLabel: 'Formal Verification',
    featured: false,
    summary: 'Formal specification and automated invariant verification harness for multi-leader distributed database failover protocols. Uncovers subtle split-brain edge cases and race conditions before production deployment.',
    metrics: [
      { label: 'States Checked/Sec', value: '420,000' },
      { label: 'Heuristic Pruning', value: '84% space reduction' },
      { label: 'Bugs Discovered', value: '7 critical RFC flaws' },
      { label: 'Language Target', value: 'TLA+ / PlusCal / Python' },
    ],
    techStack: ['TLA+', 'PlusCal', 'Python', 'SAT Solver', 'Z3'],
    stars: 890,
    forks: 62,
    license: 'BSD-3-Clause',
    architectureNotes: 'Formal methods provide mathematical certainty where empirical testing fails. Aegis-Verify defines state transition relations and safety invariants, utilizing symmetric state equivalence to collapse exponential search graphs.',
    codeSnippet: {
      language: 'tla+',
      filename: 'specs/RaftConsensusSafety.tla',
      code: `----------------------- MODULE RaftConsensusSafety -----------------------
EXTENDS Naturals, FiniteSets, Sequences

CONSTANTS Server, Quorum, MaxTerm
VARIABLES currentTerm, state, votedFor, log, commitIndex

ElectionSafety ==
    \\A s1, s2 \\in Server :
        (state[s1] = "Leader" /\\ state[s2] = "Leader" /\\ currentTerm[s1] = currentTerm[s2])
        => s1 = s2

LogMatching ==
    \\A s1, s2 \\in Server :
        \\A idx \\in 1..Min(Len(log[s1]), Len(log[s2])) :
            log[s1][idx].term = log[s2][idx].term =>
                SubSeq(log[s1], 1, idx) = SubSeq(log[s2], 1, idx)
=============================================================================`,
    },
    tradeoffs: [
      {
        chosen: 'Symbolic State Compression with Z3',
        alternative: 'Exhaustive BFS Exploration',
        reasoning: 'Allows verifying systems with up to 12 concurrent partition states within minutes instead of hours.',
      },
    ],
    benchmarks: [
      { workload: '3-Node Split-Brain Proof', baseline: '45 mins (TLC native)', optimized: '3.2 mins (Aegis symbolic)', improvement: '14x faster proof' },
    ],
  },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'fast-2025',
    title: 'Zero-Copy Tiered Compaction for Non-Volatile Memory LSM Storage',
    venue: 'USENIX Conference on File and Storage Technologies (FAST)',
    year: 2025,
    authors: ['Alex Chen', 'Marcus Thorne', 'Dr. Elena Rostova'],
    abstract: 'Log-Structured Merge-tree (LSM-tree) storage engines suffer from high write amplification and latency spikes during deep-level compaction passes. We introduce a zero-copy tiering protocol leveraging persistent memory and io_uring queues that eliminates page cache thrashing. Evaluation under YCSB demonstrates a 2.4x reduction in write amplification and a 94% reduction in tail latency under heavy concurrent ingestion.',
    citations: 34,
    doi: '10.5555/fast2025.chen.zerocopy',
    bibtex: `@inproceedings{chen2025zerocopy,
  author    = {Alex Chen and Marcus Thorne and Elena Rostova},
  title     = {Zero-Copy Tiered Compaction for Non-Volatile Memory LSM Storage},
  booktitle = {23rd USENIX Conference on File and Storage Technologies (FAST 25)},
  year      = {2025},
  pages     = {112--128},
  publisher = {USENIX Association}
}`,
    highlights: [
      'Engineered lock-free MemTable with hardware prefetching',
      'Demonstrated 2.4x lower write amplification on 10TB datasets',
      'Adopted into production by leading cloud infrastructure providers',
    ],
  },
  {
    id: 'sosp-2024',
    title: 'Deterministic Partition Recovery in Sharded Multi-Raft State Machines',
    venue: 'ACM Symposium on Operating Systems Principles (SOSP)',
    year: 2024,
    authors: ['Alex Chen', 'David K. Miller', 'Prof. Sarah Vance'],
    abstract: 'Horizontal partitioning in Multi-Raft consensus clusters introduces complex failure modes during cross-datacenter network partitions. We present a formally verified lease migration and quorum negotiation mechanism that preserves strict serializability without pausing non-overlapping partition traffic.',
    citations: 58,
    doi: '10.1145/sosp2024.raft.recovery',
    bibtex: `@inproceedings{chen2024multiraft,
  author    = {Alex Chen and David K. Miller and Sarah Vance},
  title     = {Deterministic Partition Recovery in Sharded Multi-Raft State Machines},
  booktitle = {Proceedings of the 30th ACM Symposium on Operating Systems Principles (SOSP 24)},
  year      = {2024},
  pages     = {89--104},
  publisher = {ACM}
}`,
    highlights: [
      'Proven safe under arbitrary network split-brains using TLA+',
      'Reduced partition recovery timeout from 4.5s down to 320ms',
      'Open-source reference implementation benchmarked up to 256 consensus groups',
    ],
  },
  {
    id: 'sigcomm-2023',
    title: 'Wire-Speed Kernel Invariant Verification with Programmable eBPF Pipelines',
    venue: 'ACM SIGCOMM Conference on Data Communication',
    year: 2023,
    authors: ['Alex Chen', 'Jonas Lindqvist'],
    abstract: 'Traditional network telemetry either samples packets, losing rare pathological anomalies, or introduces unacceptable CPU overhead at line rate. By shifting flow reassembly and state invariant validation into XDP driver hooks, we demonstrate wire-speed telemetry at 40Gbps with zero drop and 18ns mean latency overhead.',
    citations: 92,
    doi: '10.1145/sigcomm2023.ebpf.invariants',
    bibtex: `@inproceedings{chen2023wirespeed,
  author    = {Alex Chen and Jonas Lindqvist},
  title     = {Wire-Speed Kernel Invariant Verification with Programmable eBPF Pipelines},
  booktitle = {Proceedings of the ACM SIGCOMM 2023 Conference},
  year      = {2023},
  pages     = {245--260},
  publisher = {ACM}
}`,
    highlights: [
      'Executed at driver level before kernel sk_buff construction',
      'Sub-20ns processing latency across 38M packets per second',
      'Recipient of the SIGCOMM Best Student Artifact Award',
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Principal Systems Architect',
    organization: 'Helios Distributed Systems Corp',
    location: 'San Francisco, CA',
    period: '2023 — Present',
    description: 'Directing the architecture of the core distributed storage and consensus plane powering global edge infrastructure. Responsible for deterministic failure recovery, cross-region replication latency, and memory safety.',
    impactMetrics: [
      'Architected Multi-Raft consensus layer serving 45M+ queries/sec across 18 worldwide regions',
      'Reduced p99.9 database read latencies from 12ms to 840µs via NVMe kernel bypass',
      'Authored 4 architectural RFCs covering linearizable lease handoffs and zero-copy replication',
    ],
    techStack: ['Rust', 'C++', 'Linux Kernel', 'Multi-Raft', 'io_uring', 'eBPF'],
    rfcsAuthored: ['RFC-014: Deterministic Epoch Quorum Leases', 'RFC-029: SIMD Bloom Filter Probing for L0 SSTables'],
  },
  {
    id: 'exp-2',
    role: 'Staff Systems Software Engineer',
    organization: 'NovaCloud Infrastructure Labs',
    location: 'Zurich, Switzerland',
    period: '2021 — 2023',
    description: 'Led the runtime and storage performance team. Built zero-allocation network framing layers and optimized RocksDB engine internals for multi-tenant cloud workloads.',
    impactMetrics: [
      'Designed custom LSM-Tree compaction scheduler cutting write amplification by 62%',
      'Eliminated memory fragmentation across 12,000 cloud worker nodes with custom jemalloc arenas',
      'Mentored 8 senior engineers and represented the company at Linux Plumbers Conference',
    ],
    techStack: ['C++20', 'Rust', 'RocksDB', 'gRPC', 'DPDK', 'perf/eBPF'],
    rfcsAuthored: ['RFC-108: Non-Blocking Tiered MemTable Eviction'],
  },
  {
    id: 'exp-3',
    role: 'Systems Research Fellow',
    organization: 'MIT CSAIL / Distributed Systems Group',
    location: 'Cambridge, MA',
    period: '2019 — 2021',
    description: 'Conducted doctoral research in formal verification of distributed consensus protocols, Byzantine fault tolerance, and high-performance operating system abstractions.',
    impactMetrics: [
      'Published 3 first-author papers at USENIX FAST, ACM SOSP, and SIGCOMM',
      'Authored open-source TLA+ model checking harnesses for multi-leader Paxos variants',
      'Taught graduate-level CS 6.824: Distributed Systems Engineering',
    ],
    techStack: ['TLA+', 'Go', 'Rust', 'C', 'Formal Verification', 'Linux'],
  },
];

export const BENCHMARK_DATA: BenchmarkResult[] = [
  {
    id: 'bench-1',
    name: 'Lock-Free RingBuffer vs Standard Mutex Queue',
    category: 'Memory & Concurrency',
    baselineName: 'std::sync::Mutex<VecDeque>',
    optimizedName: 'Kuro-RingBuffer (Atomic CAS)',
    baselineOps: 1420000,
    optimizedOps: 11800000,
    baselineP99: 142.0,
    optimizedP99: 8.4,
    unit: 'ops/sec (128 Cores)',
    description: 'Evaluates throughput and tail latency under 128 contending threads. The lock-free ring buffer utilizes cache-line padding (64 bytes) to eliminate false sharing and wait-free memory barriers.',
  },
  {
    id: 'bench-2',
    name: 'Zero-Copy FlatBuffers vs Serde JSON RPC',
    category: 'Serialization & Network',
    baselineName: 'Serde JSON Parser',
    optimizedName: 'Nexus-RPC Zero-Copy View',
    baselineOps: 820000,
    optimizedOps: 7900000,
    baselineP99: 89.5,
    optimizedP99: 1.2,
    unit: 'msgs/sec / core',
    description: 'Compares deserialization overhead for 2KB structured telemetric payloads. FlatBuffers reads directly from the network buffer with zero allocations, bypassing JSON object parsing loops.',
  },
  {
    id: 'bench-3',
    name: 'LSM Leveled Compaction vs Size-Tiered',
    category: 'Storage Engine',
    baselineName: 'Standard Size-Tiered (STCS)',
    optimizedName: 'Kuro-Tiered Leveled (LCS)',
    baselineOps: 1850000,
    optimizedOps: 3800000,
    baselineP99: 840.0,
    optimizedP99: 410.0,
    unit: 'ops/sec (90% Write / 10% Read)',
    description: 'Measures sustained throughput during heavy continuous write bursts. Leveled compaction with concurrent io_uring merges prevents tail latency spikes caused by massive STCS table merges.',
  },
  {
    id: 'bench-4',
    name: 'XDP In-Kernel Filter vs User-space iptables',
    category: 'Kernel Networking',
    baselineName: 'Linux Netfilter / iptables',
    optimizedName: 'NetPulse XDP Hook (eBPF)',
    baselineOps: 4800000,
    optimizedOps: 38200000,
    baselineP99: 45.0,
    optimizedP99: 0.18,
    unit: 'packets/sec (Wire Speed)',
    description: 'Tests packet drop and routing performance under synthetic 40Gbps flood. NetPulse handles packets directly in driver memory prior to socket buffer allocation.',
  },
];
