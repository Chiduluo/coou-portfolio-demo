/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { ProjectShowcase } from './components/ProjectShowcase';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { TerminalConsole } from './components/TerminalConsole';
import { PublicationsSection } from './components/PublicationsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectCaseStudyModal } from './components/ProjectCaseStudyModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { PROJECTS } from './data/portfolioData';
import { ProjectItem } from './types/portfolio';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Intersection observer to track current active section in nav
  useEffect(() => {
    const sectionIds = [
      'hero',
      'architecture',
      'projects',
      'benchmarks',
      'terminal',
      'publications',
      'experience',
      'contact',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  const handleOpenCaseStudy = (projectId: string) => {
    const proj = PROJECTS.find((p) => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans antialiased selection:bg-blue-600/30 selection:text-white relative">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section (Split-Screen & Metric Strip) */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenCaseStudy={handleOpenCaseStudy}
        />

        {/* 2. Interactive Systems Sandbox & Architecture Visualizer */}
        <ArchitectureVisualizer />

        {/* 3. Production Engines & Artifacts Bento Matrix */}
        <ProjectShowcase onOpenCaseStudy={handleOpenCaseStudy} />

        {/* 4. Empirical Systems Micro-Benchmarks */}
        <BenchmarkSuite />

        {/* 5. Interactive System Console & Artifact Explorer */}
        <TerminalConsole onOpenCaseStudy={handleOpenCaseStudy} />

        {/* 6. Academic Research & Publications */}
        <PublicationsSection />

        {/* 7. Industry Track Record & Engineering Leadership */}
        <ExperienceTimeline />

        {/* 8. Technical Consultation & Cryptographic Contact */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Case Study Modal Lightbox */}
      <ProjectCaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Quick Search & Command Palette Modal (Cmd+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onOpenCaseStudy={handleOpenCaseStudy}
      />
    </div>
  );
}
