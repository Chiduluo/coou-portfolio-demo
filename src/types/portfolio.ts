export type ProjectCategory = 'all' | 'distributed' | 'storage' | 'runtimes' | 'ebpf';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'distributed' | 'storage' | 'runtimes' | 'ebpf';
  categoryLabel: string;
  summary: string;
  metrics: ProjectMetric[];
  techStack: string[];
  stars?: number;
  forks?: number;
  license: string;
  featured: boolean;
  architectureNotes: string;
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  tradeoffs: {
    chosen: string;
    alternative: string;
    reasoning: string;
  }[];
  benchmarks: {
    workload: string;
    baseline: string;
    optimized: string;
    improvement: string;
  }[];
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: number;
  authors: string[];
  abstract: string;
  citations: number;
  doi: string;
  bibtex: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  impactMetrics: string[];
  techStack: string[];
  rfcsAuthored?: string[];
}

export interface BenchmarkResult {
  id: string;
  name: string;
  category: string;
  baselineName: string;
  optimizedName: string;
  baselineOps: number;
  optimizedOps: number;
  baselineP99: number; // in microseconds
  optimizedP99: number;
  unit: string;
  description: string;
}
