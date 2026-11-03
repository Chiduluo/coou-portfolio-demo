import React, { useState, useEffect, useRef } from 'react';
import { Layers, Play, RefreshCw, AlertTriangle, CheckCircle2, Cpu, HardDrive, Network, Zap, ShieldCheck } from 'lucide-react';

type Mode = 'raft' | 'lsm' | 'ringbuffer';

interface RaftNode {
  id: number;
  role: 'Leader' | 'Follower' | 'Candidate' | 'Partitioned';
  term: number;
  commitIndex: number;
  logLength: number;
  isLeader: boolean;
  x: number;
  y: number;
}

export const ArchitectureVisualizer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('raft');

  // --- Raft State ---
  const [raftNodes, setRaftNodes] = useState<RaftNode[]>([
    { id: 1, role: 'Leader', term: 14, commitIndex: 842, logLength: 842, isLeader: true, x: 260, y: 70 },
    { id: 2, role: 'Follower', term: 14, commitIndex: 842, logLength: 842, isLeader: false, x: 440, y: 160 },
    { id: 3, role: 'Follower', term: 14, commitIndex: 842, logLength: 842, isLeader: false, x: 380, y: 310 },
    { id: 4, role: 'Follower', term: 14, commitIndex: 842, logLength: 842, isLeader: false, x: 140, y: 310 },
    { id: 5, role: 'Follower', term: 14, commitIndex: 842, logLength: 842, isLeader: false, x: 80, y: 160 },
  ]);
  const [raftStatusMessage, setRaftStatusMessage] = useState<string>(
    'Cluster stable. Node 1 is currently the elected Leader (Term 14).'
  );
  const [isSimulatingWrite, setIsSimulatingWrite] = useState(false);
  const [packetSignals, setPacketSignals] = useState<{ from: number; to: number; type: 'append' | 'vote' }[]>([]);

  // --- LSM State ---
  const [memTableCount, setMemTableCount] = useState(4);
  const [walOffset, setWalOffset] = useState(3840);
  const [l0Count, setL0Count] = useState(2);
  const [l1Count, setL1Count] = useState(4);
  const [l2Count, setL2Count] = useState(8);
  const [lsmLogs, setLsmLogs] = useState<string[]>([
    'System initialized. MemTable SkipList size: 4/8 entries.',
    'WAL synced to persistent storage at offset 3840.',
  ]);

  // --- Ring Buffer State ---
  const [ringBuffer, setRingBuffer] = useState<string[]>([
    '0xFA12', '0xFA13', '0xFA14', '0xFA15', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY'
  ]);
  const [headIndex, setHeadIndex] = useState(4);
  const [tailIndex, setTailIndex] = useState(0);
  const [ringLogs, setRingLogs] = useState<string>('RingBuffer ready. 4 occupied slots, 4 free slots.');

  // Raft: Propose Write Batch
  const handleProposeWrites = () => {
    const leader = raftNodes.find((n) => n.role === 'Leader');
    if (!leader) {
      setRaftStatusMessage('Cannot propose writes: No leader is currently elected in the partition!');
      return;
    }

    setIsSimulatingWrite(true);
    setRaftStatusMessage(`Leader (Node ${leader.id}) received batch write. Appending to local WAL...`);

    // Emit packet animations from leader to active followers
    const targetFollowers = raftNodes.filter((n) => n.id !== leader.id && n.role !== 'Partitioned');
    setPacketSignals(targetFollowers.map((f) => ({ from: leader.id, to: f.id, type: 'append' })));

    setTimeout(() => {
      setRaftNodes((prev) =>
        prev.map((node) => {
          if (node.role === 'Partitioned') return node;
          return {
            ...node,
            commitIndex: node.commitIndex + 10,
            logLength: node.logLength + 10,
          };
        })
      );
      setPacketSignals([]);
      setIsSimulatingWrite(false);
      setRaftStatusMessage(
        `Quorum ACK received! 10 transactions committed across ${targetFollowers.length + 1} nodes.`
      );
    }, 900);
  };

  // Raft: Partition Leader
  const handlePartitionLeader = () => {
    const leader = raftNodes.find((n) => n.role === 'Leader');
    if (!leader) return;

    setRaftStatusMessage(`Simulating network split: Node ${leader.id} isolated from cluster.`);
    setRaftNodes((prev) =>
      prev.map((node) => (node.id === leader.id ? { ...node, role: 'Partitioned', isLeader: false } : node))
    );

    // After heartbeat timeout, remaining nodes hold election
    setTimeout(() => {
      setRaftStatusMessage('Followers timed out on leader heartbeat. Initiating candidate election...');
      // Candidate will be Node 2
      const candidateId = 2;
      setRaftNodes((prev) =>
        prev.map((node) =>
          node.id === candidateId
            ? { ...node, role: 'Candidate', term: node.term + 1 }
            : node.role === 'Partitioned'
            ? node
            : { ...node, role: 'Follower' }
        )
      );

      // Send vote request packets
      setPacketSignals([
        { from: candidateId, to: 3, type: 'vote' },
        { from: candidateId, to: 4, type: 'vote' },
        { from: candidateId, to: 5, type: 'vote' },
      ]);

      setTimeout(() => {
        setPacketSignals([]);
        setRaftNodes((prev) =>
          prev.map((node) =>
            node.id === candidateId
              ? { ...node, role: 'Leader', isLeader: true }
              : node.role === 'Partitioned'
              ? node
              : { ...node, term: node.term + 1 }
          )
        );
        setRaftStatusMessage(`Election complete! Node ${candidateId} won majority quorum (Term 15 Leader).`);
      }, 1000);
    }, 1100);
  };

  // Raft: Heal Partition
  const handleHealPartition = () => {
    const highestTerm = Math.max(...raftNodes.map((n) => n.term));
    const highestCommit = Math.max(...raftNodes.map((n) => n.commitIndex));

    setRaftStatusMessage('Reconnecting partitioned nodes and synchronizing lagging logs...');
    setRaftNodes((prev) =>
      prev.map((node) => ({
        ...node,
        role: node.isLeader ? 'Leader' : 'Follower',
        term: highestTerm,
        commitIndex: highestCommit,
        logLength: highestCommit,
      }))
    );
    setPacketSignals([]);
    setTimeout(() => {
      setRaftStatusMessage('All 5 nodes synchronized and in consensus. Cluster topology intact.');
    }, 600);
  };

  // LSM: Insert Key-Value
  const handleLsmInsert = () => {
    if (memTableCount < 7) {
      const nextCount = memTableCount + 1;
      setMemTableCount(nextCount);
      setWalOffset((prev) => prev + 128);
      setLsmLogs((prev) => [
        `[PUT] Added key "sys:metric:${Date.now().toString().slice(-4)}" -> MemTable (${nextCount}/8). WAL synced.`,
        ...prev.slice(0, 3),
      ]);
    } else {
      // Flush MemTable to L0 SSTable
      setMemTableCount(1);
      setL0Count((prev) => prev + 1);
      setWalOffset((prev) => prev + 512);
      setLsmLogs((prev) => [
        `[FLUSH] MemTable reached 8/8 capacity. Flushed immutable MemTable to L0 SSTable!`,
        `[WAL] Reset active WAL segment. Active L0 tables: ${l0Count + 1}`,
        ...prev.slice(0, 2),
      ]);
    }
  };

  // LSM: Trigger Leveled Compaction
  const handleLsmCompaction = () => {
    setL0Count(0);
    setL1Count((prev) => prev + 2);
    setLsmLogs((prev) => [
      `[COMPACT] Leveled merge-sort completed: L0 -> L1. AVX-512 bloom filters generated.`,
      `[METRIC] Write amplification bounded to 2.4x. Freed 32MB disk fragmentation.`,
      ...prev.slice(0, 2),
    ]);
  };

  // RingBuffer: Push
  const handleRingPush = () => {
    if (ringBuffer[headIndex] !== 'EMPTY') {
      setRingLogs('RingBuffer FULL! Backpressure applied; producer thread yielded.');
      return;
    }
    const val = '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase();
    const nextBuf = [...ringBuffer];
    nextBuf[headIndex] = val;
    setRingBuffer(nextBuf);
    const nextHead = (headIndex + 1) % 8;
    setHeadIndex(nextHead);
    setRingLogs(`Produced item ${val} at slot [${headIndex}]. Atomic Release fence emitted.`);
  };

  // RingBuffer: Pop
  const handleRingPop = () => {
    if (ringBuffer[tailIndex] === 'EMPTY') {
      setRingLogs('RingBuffer EMPTY! Consumer thread spinning on atomic acquire.');
      return;
    }
    const popped = ringBuffer[tailIndex];
    const nextBuf = [...ringBuffer];
    nextBuf[tailIndex] = 'EMPTY';
    setRingBuffer(nextBuf);
    const nextTail = (tailIndex + 1) % 8;
    setTailIndex(nextTail);
    setRingLogs(`Consumed item ${popped} from slot [${tailIndex}]. Zero-copy view dispatched.`);
  };

  return (
    <section id="architecture" className="py-20 bg-[#091022] border-t border-b border-slate-800/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Systems Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
              Distributed Systems & Storage Visualizer
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Inspect the live state transitions of distributed consensus, memory-mapped write pipelines,
              and wait-free concurrent queue primitives.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveMode('raft')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                activeMode === 'raft'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Raft Consensus</span>
            </button>

            <button
              onClick={() => setActiveMode('lsm')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                activeMode === 'lsm'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>LSM Storage</span>
            </button>

            <button
              onClick={() => setActiveMode('ringbuffer')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                activeMode === 'ringbuffer'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lock-Free Ring</span>
            </button>
          </div>
        </div>

        {/* Visualizer Canvas Card */}
        <div className="bg-[#0c1427] rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
          {/* Mode 1: Raft Consensus Protocol Visualizer */}
          {activeMode === 'raft' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleProposeWrites}
                    disabled={isSimulatingWrite}
                    className="kinetic-btn-primary !py-2 !px-3.5 text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    <span>Propose 10 Writes</span>
                  </button>

                  <button
                    onClick={handlePartitionLeader}
                    className="kinetic-btn-secondary !py-2 !px-3.5 text-xs font-mono text-red-400 hover:text-red-300 hover:border-red-500/50 flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Partition Leader (Node 1)</span>
                  </button>

                  <button
                    onClick={handleHealPartition}
                    className="kinetic-btn-secondary !py-2 !px-3.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Heal Network Quorum</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>5-Node Quorum Mesh</span>
                </div>
              </div>

              {/* Raft Interactive Cluster Graphic */}
              <div className="relative h-[380px] w-full bg-[#080e1b] rounded-xl border border-slate-800/60 flex items-center justify-center overflow-hidden">
                {/* SVG Connections between mesh nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {raftNodes.map((n1, i) =>
                    raftNodes.slice(i + 1).map((n2) => (
                      <line
                        key={`${n1.id}-${n2.id}`}
                        x1={n1.x}
                        y1={n1.y}
                        x2={n2.x}
                        y2={n2.y}
                        stroke={
                          n1.role === 'Partitioned' || n2.role === 'Partitioned'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(51, 65, 85, 0.4)'
                        }
                        strokeWidth="1.5"
                        strokeDasharray={
                          n1.role === 'Partitioned' || n2.role === 'Partitioned' ? '4 4' : 'none'
                        }
                      />
                    ))
                  )}

                  {/* Dynamic in-flight packet signals */}
                  {packetSignals.map((pkt, idx) => {
                    const fromNode = raftNodes.find((n) => n.id === pkt.from);
                    const toNode = raftNodes.find((n) => n.id === pkt.to);
                    if (!fromNode || !toNode) return null;
                    return (
                      <circle
                        key={idx}
                        cx={(fromNode.x + toNode.x) / 2}
                        cy={(fromNode.y + toNode.y) / 2}
                        r="5"
                        fill={pkt.type === 'append' ? '#38bdf8' : '#eab308'}
                        className="animate-ping"
                      />
                    );
                  })}
                </svg>

                {/* Nodes rendering */}
                {raftNodes.map((node) => {
                  const isLeader = node.role === 'Leader';
                  const isCandidate = node.role === 'Candidate';
                  const isPartitioned = node.role === 'Partitioned';

                  return (
                    <div
                      key={node.id}
                      style={{ left: `${node.x - 55}px`, top: `${node.y - 45}px` }}
                      className={`absolute w-[110px] p-2.5 rounded-xl border font-mono text-center transition-all duration-300 shadow-lg ${
                        isLeader
                          ? 'bg-blue-950/80 border-blue-400 text-blue-200 ring-2 ring-blue-500/30 shadow-blue-900/50'
                          : isCandidate
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 animate-pulse'
                          : isPartitioned
                          ? 'bg-red-950/70 border-red-500/70 text-red-300 opacity-60'
                          : 'bg-[#131b2e] border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold">Node {node.id}</span>
                        <span className="text-slate-500">T:{node.term}</span>
                      </div>
                      <div
                        className={`text-xs font-semibold py-0.5 rounded ${
                          isLeader
                            ? 'text-sky-300 font-bold'
                            : isCandidate
                            ? 'text-yellow-300'
                            : isPartitioned
                            ? 'text-red-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {node.role}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Index: #{node.commitIndex}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Raft Status Bar & Explanatory Log */}
              <div className="p-3.5 bg-[#080d19] rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{raftStatusMessage}</span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
                  Raft Safety Invariant: Invariant 1 (Election Safety) Verified
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: LSM Storage Pipeline Visualizer */}
          {activeMode === 'lsm' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLsmInsert}
                    className="kinetic-btn-primary !py-2 !px-3.5 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>Insert Key-Value (PUT)</span>
                  </button>

                  <button
                    onClick={handleLsmCompaction}
                    className="kinetic-btn-secondary !py-2 !px-3.5 text-xs font-mono flex items-center gap-1.5 text-sky-300"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Trigger Leveled Compaction (L0 → L1)</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  <span>WAL Offset: </span>
                  <span className="text-sky-400 font-bold tabular-nums">+{walOffset} bytes</span>
                </div>
              </div>

              {/* Multi-tier Storage Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stage 1: Volatile In-Memory (MemTable + WAL) */}
                <div className="p-4 bg-[#080e1b] rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">1. In-Memory Layer</span>
                    <span className="text-sky-400">RAM (Lock-Free)</span>
                  </div>

                  {/* MemTable Buffer representation */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                      <span>Concurrent SkipList MemTable</span>
                      <span>{memTableCount}/8 slots</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-8 rounded text-[10px] font-mono flex items-center justify-center transition-all ${
                            idx < memTableCount
                              ? 'bg-blue-600/40 border border-blue-400/80 text-blue-200'
                              : 'bg-slate-900 border border-slate-800 text-slate-600'
                          }`}
                        >
                          {idx < memTableCount ? `k_${idx + 1}` : 'free'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WAL (Append-Only Log) */}
                  <div className="p-2.5 rounded-lg bg-[#0e172a] border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>io_uring Direct WAL</span>
                      <span className="text-emerald-400">SYNC OK</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      O_DIRECT | 4KB Page Align | No PageCache
                    </div>
                  </div>
                </div>

                {/* Stage 2: Level 0 SSTables (Uncompacted disk) */}
                <div className="p-4 bg-[#080e1b] rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">2. Level 0 SSTables</span>
                    <span className="text-amber-400">NVMe Flushed</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Keys may overlap across files. Point lookups probe SIMD Bloom filter.
                  </p>

                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-colors ${
                          idx < l0Count
                            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <span>SSTable_00{idx + 1}.sst</span>
                        <span className="text-[10px]">
                          {idx < l0Count ? 'AVX-512 Probed' : 'Empty'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage 3: Level 1 & Level 2 Leveled Compaction */}
                <div className="p-4 bg-[#080e1b] rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">3. Level 1 & 2 Partitions</span>
                    <span className="text-emerald-400">Disjoint Ranges</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Non-overlapping key ranges. Zero duplicate keys. At most 1 disk read per point get.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                      <div className="text-[10px] text-slate-400">L1 Partitions</div>
                      <div className="text-base font-bold tabular-nums">{l1Count} Tables</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/40 text-blue-200">
                      <div className="text-[10px] text-slate-400">L2 Partitions</div>
                      <div className="text-base font-bold tabular-nums">{l2Count} Tables</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution log for LSM */}
              <div className="p-3 bg-[#080d19] rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                {lsmLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Lock-Free RingBuffer Visualizer */}
          {activeMode === 'ringbuffer' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRingPush}
                    className="kinetic-btn-primary !py-2 !px-3.5 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>Push Item (Producer CAS)</span>
                  </button>

                  <button
                    onClick={handleRingPop}
                    className="kinetic-btn-secondary !py-2 !px-3.5 text-xs font-mono flex items-center gap-1.5 text-sky-400"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Pop Item (Consumer Acquire)</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  <span>Head: </span>
                  <span className="text-sky-400 font-bold mr-3">[{headIndex}]</span>
                  <span>Tail: </span>
                  <span className="text-emerald-400 font-bold">[{tailIndex}]</span>
                </div>
              </div>

              {/* 8-Slot Circular Array Graphic */}
              <div className="p-6 bg-[#080e1b] rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {ringBuffer.map((val, idx) => {
                    const isHead = idx === headIndex;
                    const isTail = idx === tailIndex;
                    const isOccupied = val !== 'EMPTY';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border font-mono text-center relative transition-all duration-200 ${
                          isOccupied
                            ? 'bg-blue-950/60 border-blue-400/80 text-blue-200 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500 mb-1">Slot #{idx}</div>
                        <div className="text-xs font-bold">{val}</div>

                        {/* Head & Tail pointers */}
                        <div className="mt-2 flex items-center justify-center gap-1">
                          {isHead && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                              HEAD
                            </span>
                          )}
                          {isTail && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                              TAIL
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-4">
                  <div>Cache-line alignment: 64-byte padding prevents cross-core L1 false sharing.</div>
                  <div className="text-sky-400 font-semibold">{ringLogs}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
