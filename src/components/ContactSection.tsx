import React, { useState } from 'react';
import { Mail, Shield, Copy, Check, Send, CheckCircle2, Terminal } from 'lucide-react';
import { ENGINEER_PROFILE } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: 'architecture_audit',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedPgp, setCopiedPgp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const handleCopyPgp = () => {
    navigator.clipboard.writeText(ENGINEER_PROFILE.pgpKey);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-[#091022] border-t border-slate-800/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Cryptographic Fingerprint */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>Technical Consultation & Advising</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] tracking-tight">
                Initiate Systems Consultation
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Available for advisory roles, distributed storage architecture reviews, formal safety
                audits, and keynote technical consultations.
              </p>
            </div>

            {/* Direct Email link */}
            <div className="p-4 rounded-xl bg-[#0e172a] border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                Direct Communication
              </div>
              <a
                href={`mailto:${ENGINEER_PROFILE.email}`}
                className="text-sm font-mono text-sky-400 hover:underline block truncate"
              >
                {ENGINEER_PROFILE.email}
              </a>
              <div className="text-xs text-slate-500 font-mono">
                Location: {ENGINEER_PROFILE.location}
              </div>
            </div>

            {/* PGP Public Key Box */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>PGP Key (4096R/DE3F)</span>
                </div>
                <button
                  onClick={handleCopyPgp}
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  {copiedPgp ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 break-all select-all bg-[#060c18] p-2.5 rounded border border-slate-800/80">
                8F2A 4C19 90E1 BD45 61A2 77F0 3B9E A012 4589 DE3F
              </div>
              <p className="text-[11px] text-slate-500">
                Encrypted correspondence welcome for sensitive vulnerability disclosures and proprietary designs.
              </p>
            </div>
          </div>

          {/* Right Column: High-Precision Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0c1427] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Consultation Request Dispatched</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out, {formData.name}. I have received your systems inquiry and
                  will review the architectural requirements within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      organization: '',
                      inquiryType: 'architecture_audit',
                      message: '',
                    });
                  }}
                  className="kinetic-btn-secondary !py-2 !px-4 text-xs font-mono"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-medium">
                      Your Name / Handle <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Jordan Reed"
                      className="kinetic-input w-full px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-medium">
                      Email Address <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jordan@infrastructure.io"
                      className="kinetic-input w-full px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-medium">
                      Organization / Venture
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. CloudScale Systems"
                      className="kinetic-input w-full px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-medium">
                      Inquiry Scope
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="kinetic-input w-full px-3.5 py-2.5 text-sm bg-[#0f172a]"
                    >
                      <option value="architecture_audit">Distributed Systems Architecture Audit</option>
                      <option value="storage_engine">LSM-Tree / NVMe Storage Optimization</option>
                      <option value="formal_verification">TLA+ Protocol Safety Verification</option>
                      <option value="advisory">Advisory & Technical Consultation</option>
                      <option value="research">Academic / Research Collaboration</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">
                    Technical Problem Statement & Workload Details <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe target SLA, core count, ingestion throughput, consensus requirements, or specific bottlenecks..."
                    className="kinetic-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    256-bit TLS encrypted transmission
                  </span>

                  <button
                    type="submit"
                    className="kinetic-btn-primary flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
                  >
                    <span>Dispatch Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
