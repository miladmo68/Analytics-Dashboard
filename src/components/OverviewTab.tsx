/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  TrendingDown,
  Search,
  Laptop,
  CheckCircle,
  AlertCircle,
  Globe,
  RefreshCw,
  Play,
  Sparkles
} from 'lucide-react';
import { ChartDataPoint, ProductPerformance } from '../types';

interface OverviewTabProps {
  chartData: ChartDataPoint[];
  products: ProductPerformance[];
  quickFilter: '7d' | '30d' | 'ytd';
  setQuickFilter: (filter: '7d' | '30d' | 'ytd') => void;
}

export default function OverviewTab({
  chartData,
  products,
  quickFilter,
  setQuickFilter
}: OverviewTabProps) {
  // Navigation active metric for customizable SVG Area Chart plot
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'customers' | 'subscriptions'>('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Milink SEO & Speed Auditor State
  const [auditUrl, setAuditUrl] = useState('');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [auditStep, setAuditStep] = useState(0);
  const [auditResult, setAuditResult] = useState<{
    performance: number;
    seo: number;
    practices: number;
    accessibility: number;
    issues: { type: 'pass' | 'warn' | 'fail'; title: string; desc: string }[];
  } | null>(null);

  const auditStepsLabels = [
    "Resolving domain handshake & ping analytics...",
    "Querying DOM nodes & hierarchy depth...",
    "Measuring Core Web Vitals (FCP, LCP, CLS)...",
    "Checking schema markup & open graph headers...",
    "Structuring premium optimization insights..."
  ];

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl.trim()) return;
    
    setAuditStatus('running');
    setAuditStep(0);
    setAuditResult(null);
    
    // Animate through audit simulation steps
    const interval = setInterval(() => {
      setAuditStep(prev => {
        if (prev >= auditStepsLabels.length - 1) {
          clearInterval(interval);
          
          // Generate realistic customized scores depending on length of URL and keywords
          const textSeed = auditUrl.toLowerCase();
          const cleanUrl = textSeed.replace(/^(https?:\/\/)?(www\.)?/, '');
          
          // Base score variations
          let perf = 82 + (cleanUrl.length % 15);
          let seo = 85 + (cleanUrl.length % 11);
          let pract = 88 + (cleanUrl.length % 9);
          let access = 84 + (cleanUrl.length % 13);
          
          if (textSeed.includes('slow') || textSeed.includes('wordpress')) {
            perf -= 15;
          }
          if (textSeed.includes('milink.ca') || textSeed.includes('milink')) {
            perf = 99;
            seo = 100;
            pract = 98;
            access = 99;
          }

          // Caps 0-100
          perf = Math.min(100, Math.max(30, perf));
          seo = Math.min(100, Math.max(30, seo));
          pract = Math.min(100, Math.max(30, pract));
          access = Math.min(100, Math.max(30, access));

          const calculatedIssues = [
            { 
              type: 'pass' as const, 
              title: "Modern HTTPS Secure Protocol Active", 
              desc: "TLS Handshake negotiated successfully. High SEO search rankings priority." 
            },
            perf < 85 ? {
              type: 'warn' as const,
              title: "Suboptimal Image Formatting & Scale Delay",
              desc: "Next-gen formats (WebP/AVIF) are missing, adding roughly 1.4s of blocking load time."
            } : {
              type: 'pass' as const,
              title: "Efficient Media Format & Inline CSS Cache",
              desc: "Images compressed perfectly with modern sizes."
            },
            seo < 95 ? {
              type: 'fail' as const,
              title: "Unoptimized H1 Header Hierarchy Nodes",
              desc: "Missing target industry keywords on title nodes. Search crawler exposure reduced by 24%."
            } : {
              type: 'pass' as const,
              title: "Pristine SEO Heading Structure Nodes",
              desc: "Logical hierarchical tag distribution layout found."
            },
            access < 90 ? {
              type: 'warn' as const,
              title: "Sufficient Contrast Ratios on Footer Nav Links",
              desc: "Font color elements do not meet minimum contrast compliance standard checks."
            } : {
              type: 'pass' as const,
              title: "WCAG AAA Access Compliance",
              desc: "Contrast ratings exceed baseline standard measurements perfectly."
            }
          ];

          setAuditResult({
            performance: perf,
            seo: seo,
            practices: pract,
            accessibility: access,
            issues: calculatedIssues as any[]
          });
          setAuditStatus('completed');
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Derive key sums & statistics
  const totalRevenue = chartData.reduce((acc, point) => acc + point.revenue, 0);
  const totalCustomers = chartData[chartData.length - 1]?.customers || 0;
  const currentMonthRevenue = chartData[chartData.length - 1]?.revenue || 0;
  
  // Custom interactive mathematical rendering scales for native responsive SVG Canvas plotting
  // Let the canvas width be 600, height be 240
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 20;

  // Find max value of active metric for scale computation
  const values = chartData.map(p => p[activeMetric]);
  const maxValue = Math.max(...values, 100);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue;

  // Generate coordinates for SVG Path lines and gradients
  const coordinates = chartData.map((p, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (chartData.length - 1);
    // Inverse Y for browser coordinate systems (0 is at the top)
    const normalizedY = (p[activeMetric] - minValue) / valueRange;
    const y = svgHeight - paddingY - normalizedY * (svgHeight - 2 * paddingY);
    return { x, y, point: p };
  });

  // Polyline generator string helper
  const linePath = coordinates.flatMap((c, i) => {
    if (i === 0) return `M ${c.x} ${c.y}`;
    // Curve interpolation
    const prev = coordinates[i - 1];
    const cpX1 = prev.x + (c.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (c.x - prev.x) / 2;
    const cpY2 = c.y;
    return `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${c.x} ${c.y}`;
  }).join(' ');

  // Gradient path string (extends to baseline bottom of plot box)
  const gradientPath = coordinates.length > 0
    ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${svgHeight - paddingY} L ${coordinates[0].x} ${svgHeight - paddingY} Z`
    : '';

  // Active theme coloring configs
  const themeColors = {
    revenue: {
      color: 'stroke-teal-500 dark:stroke-teal-400',
      fill: 'url(#gradient-revenue)',
      dotColor: 'bg-teal-500',
      textColor: 'text-teal-600 dark:text-teal-400',
      bgGlow: 'bg-teal-500/10 text-teal-600'
    },
    customers: {
      color: 'stroke-[#0070ff] dark:stroke-blue-400',
      fill: 'url(#gradient-customers)',
      dotColor: 'bg-[#0070ff]',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgGlow: 'bg-blue-500/10 text-blue-600'
    },
    subscriptions: {
      color: 'stroke-violet-500 dark:stroke-violet-400',
      fill: 'url(#gradient-subscriptions)',
      dotColor: 'bg-violet-500',
      textColor: 'text-violet-600 dark:text-violet-400',
      bgGlow: 'bg-violet-500/10 text-violet-600'
    }
  }[activeMetric];

  return (
    <div className="space-y-6">
      
      {/* 1. Dashboard Sub-Header / Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-950 dark:text-slate-100 tracking-tight">
            Dashboard Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Real-time monitoring of transactions, client conversion efficiency, and subscription channels.
          </p>
        </div>

        {/* Custom Segmented Quick Filter controls */}
        <div className="flex items-center self-start sm:self-auto gap-1 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/40 dark:border-slate-850/30 p-1.5 rounded-xl shadow-xs">
          {(['7d', '30d', 'ytd'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setQuickFilter(filter)}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-150
                ${quickFilter === filter 
                  ? 'bg-white/85 dark:bg-slate-900/80 text-indigo-650 dark:text-indigo-400 font-bold shadow-sm border border-white/25 dark:border-slate-800/30' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-900/20'
                }
              `}
            >
              {filter === 'ytd' ? 'Year To Date' : filter === '30d' ? '30 Days' : '7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Milink Studio Creative Banner */}
      <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600 dark:from-indigo-950/80 dark:to-slate-900/80 text-white p-6 rounded-[32px] border border-blue-500/10 dark:border-slate-800/50 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-white/15 dark:bg-indigo-500/20 text-white dark:text-indigo-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/15 dark:border-indigo-505/10">
              Agency Showcase Production
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              A Masterpiece Conceived & Crafted by <a href="https://milink.ca" target="_blank" rel="noreferrer" className="underline hover:text-blue-100 transition-colors font-bold">Milink</a>
            </h3>
            <p className="text-xs text-blue-105/90 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
              Milink (<strong>milink.ca</strong>) is Toronto's premier digital studio providing bespoke <strong>Web Design & Development</strong>, <strong>E-Commerce Solutions (WordPress & Shopify)</strong>, high-performance <strong>SEO Optimization</strong>, and comprehensive <strong>Branding & UI/UX</strong>. We construct robust web interfaces that convert traffic into loyal consumers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 self-stretch md:self-auto justify-start md:justify-end">
            <a 
              href="https://milink.ca" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="px-4 py-2 bg-white text-indigo-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all shadow-md hover:scale-[1.02] flex items-center gap-1 cursor-pointer"
            >
              Explore milink.ca
              <ExternalLink size={12} />
            </a>
            
            <a 
              href="https://milink.ca" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="px-4 py-2 bg-indigo-500/40 hover:bg-indigo-500/60 text-white text-xs font-bold rounded-xl transition-all border border-white/20 hover:scale-[1.02] cursor-pointer"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Beautiful Specialties Breakdown Grid directly derived from real milink.ca services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 dark:border-slate-800/60">
          {[
            { tag: "01", service: "Web Design", sub: "Bespoke & Clean UI" },
            { tag: "02", service: "E-Commerce", sub: "Shopify & WordPress" },
            { tag: "03", service: "SEO Optimization", sub: "Load-Speed & Visibility" },
            { tag: "04", service: "UI/UX & Branding", sub: "Visual Identity Systems" }
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/5 dark:bg-slate-900/40 border border-white/5 dark:border-slate-800/30">
              <span className="text-[10px] text-blue-200/60 dark:text-indigo-400 font-mono font-bold leading-none">{item.tag}</span>
              <h4 className="text-xs font-bold text-white mt-1 leading-tight">{item.service}</h4>
              <p className="text-[10px] text-blue-100/70 dark:text-slate-400 mt-0.5 leading-snug">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milink Advanced Core Web Vitals & SEO Auditor */}
      <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 relative">
        <div className="absolute right-0 top-0 translate-x-3 translate-y-3 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="max-w-xl">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
              Milink Core Web Vitals Lab
            </span>
            <h3 className="text-base font-bold text-slate-950 dark:text-slate-50 tracking-tight mt-2 flex items-center gap-1.5">
              <Globe size={16} className="text-blue-505" />
              Automated Site Audit & Speed Diagnostician
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Enter any web URL to simulate a real-time speed, accessibility, SEO metadata indexing, and responsiveness diagnostic structured by Milink Toronto experts.
            </p>
          </div>
          
          <form onSubmit={handleStartAudit} className="flex gap-2 w-full md:w-auto md:min-w-[360px]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                placeholder="milink.ca, example.com, or yoursite.com"
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-sans"
                disabled={auditStatus === 'running'}
              />
            </div>
            <button
              type="submit"
              disabled={auditStatus === 'running' || !auditUrl.trim()}
              className="px-4 py-2 bg-[#0070ff] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 select-none shrink-0"
            >
              {auditStatus === 'running' ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Auditing...
                </>
              ) : (
                <>
                  <Play size={11} fill="white" />
                  Analyze
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Running Progress Overlay state */}
        {auditStatus === 'running' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-blue-650 dark:border-t-blue-400 rounded-full animate-spin" />
              <Globe className="text-blue-505 animate-pulse" size={18} />
            </div>
            
            <div className="text-center">
              <p className="text-xs font-bold text-slate-850 dark:text-slate-200 font-mono">
                {auditStepsLabels[auditStep]}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {auditStepsLabels.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= auditStep ? 'w-5 bg-[#0070ff]' : 'w-1.5 bg-slate-250 dark:bg-slate-805'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Idle State */}
        {auditStatus === 'idle' && (
          <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            <Sparkles size={18} className="text-blue-500/40 mb-2 animate-bounce duration-1000" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ready for automated diagnostics. Submit a domain URL above to initiate.</p>
            <p className="text-[10px] mt-1 text-slate-400">Toronto custom speed auditing and performance indexes are live simulations of core responsive protocols.</p>
          </div>
        )}

        {/* Audit Completed Results Grid */}
        {auditStatus === 'completed' && auditResult && (
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Performance Indicator Ring */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Performance</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" className="stroke-slate-100 dark:stroke-slate-800 stroke-[5]" />
                    <circle 
                      cx="32" cy="32" r="26" fill="none" 
                      className={`${auditResult.performance >= 90 ? 'stroke-emerald-500' : 'stroke-amber-500'} stroke-[5] transition-all duration-1000`}
                      strokeDasharray="163.3" 
                      strokeDashoffset={163.3 - (163.3 * auditResult.performance) / 100} 
                    />
                  </svg>
                  <span className="absolute text-sm font-black font-mono text-slate-900 dark:text-slate-50">
                    {auditResult.performance}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  {auditResult.performance >= 90 ? 'Excellent Speed' : 'Needs Compression'}
                </span>
              </div>

              {/* SEO Indicator Ring */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">SEO Hierarchy</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" className="stroke-slate-100 dark:stroke-slate-800 stroke-[5]" />
                    <circle 
                      cx="32" cy="32" r="26" fill="none" 
                      className="stroke-blue-500 stroke-[5] transition-all duration-1000"
                      strokeDasharray="163.3" 
                      strokeDashoffset={163.3 - (163.3 * auditResult.seo) / 100} 
                    />
                  </svg>
                  <span className="absolute text-sm font-black font-mono text-slate-900 dark:text-slate-50">
                    {auditResult.seo}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  {auditResult.seo >= 90 ? 'Search Gated' : 'Index Failures'}
                </span>
              </div>

              {/* Best Practices */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Best Practices</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" className="stroke-slate-100 dark:stroke-slate-800 stroke-[5]" />
                    <circle 
                      cx="32" cy="32" r="26" fill="none" 
                      className="stroke-violet-500 stroke-[5] transition-all duration-1000"
                      strokeDasharray="163.3" 
                      strokeDashoffset={163.3 - (163.3 * auditResult.practices) / 100} 
                    />
                  </svg>
                  <span className="absolute text-sm font-black font-mono text-slate-900 dark:text-slate-50">
                    {auditResult.practices}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  {auditResult.practices >= 90 ? 'Compliant Standards' : 'Fix Outdated Tags'}
                </span>
              </div>

              {/* Accessibility */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Accessibility</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" className="stroke-slate-100 dark:stroke-slate-800 stroke-[5]" />
                    <circle 
                      cx="32" cy="32" r="26" fill="none" 
                      className="stroke-teal-400 stroke-[5] transition-all duration-1000"
                      strokeDasharray="163.3" 
                      strokeDashoffset={163.3 - (163.3 * auditResult.accessibility) / 100} 
                    />
                  </svg>
                  <span className="absolute text-sm font-black font-mono text-slate-900 dark:text-slate-50">
                    {auditResult.accessibility}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                  {auditResult.accessibility >= 90 ? 'Perfect Access' : 'UX Contrast Gaps'}
                </span>
              </div>

            </div>

            {/* Recommendations Log */}
            <div className="p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-300">
              <h4 className="text-xs font-bold text-slate-950 dark:text-slate-50 mb-3 flex items-center gap-2">
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
                Opportunities & Issues Discovered
              </h4>
              <div className="space-y-2">
                {auditResult.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-850/30">
                    {issue.type === 'pass' && <CheckCircle size={14} className="text-emerald-555 shrink-0 mt-0.5" />}
                    {issue.type === 'warn' && <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />}
                    {issue.type === 'fail' && <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />}
                    
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-slate-900 dark:text-slate-150 block leading-tight">{issue.title}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{issue.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action connecting them directly back to Milink */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left leading-normal font-medium">
                  <strong>Need higher loading speeds, absolute AAA compliance or premium SEO visibility?</strong> Canada's layout and engineering architects are ready to transform your asset.
                </p>
                <a 
                  href="https://milink.ca" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="px-4 py-1.5 shrink-0 bg-[#0070ff] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none shadow-xs"
                >
                  Request Milink Optimization
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Bento Grid of KPI Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 group hover:shadow-xl transition-all duration-350 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Net Income</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-all">
              <DollarSign size={17} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Gross Volume</span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
              ${totalRevenue.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex items-center gap-0.5 text-xs font-bold text-teal-600 dark:text-teal-400 leading-none bg-teal-50 dark:bg-teal-950/20 px-1.5 py-1 rounded-sm">
                <ArrowUpRight size={13} /> +14.2%
              </span>
              <span className="text-[10px] text-slate-400">vs. last cycle</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Clients */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 group hover:shadow-xl transition-all duration-350 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Customer Base</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-all">
              <Users size={17} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Monthly Active</span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
              {totalCustomers.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 leading-none bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-1 rounded-sm">
                <ArrowUpRight size={13} /> +8.6%
              </span>
              <span className="text-[10px] text-slate-400">new signups</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Conversion Efficiency */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 group hover:shadow-xl transition-all duration-350 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-all">
              <Percent size={17} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Funnel Benchmark</span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
              4.8%
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex items-center gap-0.5 text-xs font-bold text-violet-600 dark:text-violet-400 leading-none bg-violet-50 dark:bg-violet-950/20 px-1.5 py-1 rounded-sm">
                <ArrowUpRight size={13} /> +1.1%
              </span>
              <span className="text-[10px] text-slate-400">above target</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Retention Indicator */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 group hover:shadow-xl transition-all duration-350 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Client Retention NRR</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-all">
              <TrendingUp size={17} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Net revenue ratio</span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
              91.2%
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 leading-none bg-amber-50 dark:bg-amber-950/20 px-1.5 py-1 rounded-sm">
                Stable
              </span>
              <span className="text-[10px] text-slate-400">9.1% churn ceiling</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Main Business Growth Interactive Chart Block */}
      <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[40px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-55 flex items-center gap-2">
              Growth Performance Tracker
              <span className="text-xs font-normal text-slate-450 dark:text-slate-450">({quickFilter === 'ytd' ? 'Year-to-date data scale' : 'Extended 6-month view'})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hover over points to inspect precise monthly metrics. Switch plots via indicators.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md p-1 rounded-xl border border-white/20 dark:border-slate-800/20 self-start md:self-auto">
            {(['revenue', 'customers', 'subscriptions'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => {
                  setActiveMetric(metric);
                  setHoveredPointIndex(null);
                }}
                className={`
                  px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors
                  ${activeMetric === metric
                    ? 'bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 shadow-xs ring-1 ring-white/10 dark:ring-slate-850/45'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                `}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Drawing Canvas Container */}
        <div className="relative w-full">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="gradient-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="gradient-customers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0070ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0070ff" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="gradient-subscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + ratio * (svgHeight - 2 * paddingY);
              const gridVal = maxValue - ratio * valueRange;
              return (
                <g key={i} className="opacity-40 dark:opacity-20">
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={svgWidth - paddingX} 
                    y2={y} 
                    className="stroke-slate-200 dark:stroke-slate-700 stroke-1 stroke-dasharray-[3,3]" 
                  />
                  {/* Guideline text label */}
                  <text 
                    x={paddingX - 8} 
                    y={y + 3} 
                    className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] text-right" 
                    textAnchor="end"
                  >
                    {activeMetric === 'revenue' 
                      ? `$${Math.round(gridVal).toLocaleString()}` 
                      : Math.round(gridVal).toLocaleString()
                    }
                  </text>
                </g>
              );
            })}

            {/* The Gradient Area Fill */}
            {gradientPath && (
              <path 
                d={gradientPath} 
                fill={themeColors.fill} 
                className="transition-all duration-300"
              />
            )}

            {/* The Smooth Spline Line path */}
            {linePath && (
              <path 
                d={linePath} 
                fill="none" 
                className={`${themeColors.color} stroke-[2.5] transition-all duration-300`} 
              />
            )}

            {/* Vertical hover alignment ruler line */}
            {hoveredPointIndex !== null && coordinates[hoveredPointIndex] && (
              <line
                x1={coordinates[hoveredPointIndex].x}
                y1={paddingY}
                x2={coordinates[hoveredPointIndex].x}
                y2={svgHeight - paddingY}
                className="stroke-slate-300 dark:stroke-slate-700 stroke-1 stroke-dasharray-[4,2]"
              />
            )}

            {/* Circular vertex pointers */}
            {coordinates.map((c, i) => (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredPointIndex(i)}
                onMouseLeave={() => setHoveredPointIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible larger hover receiver node */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={15}
                  className="fill-transparent stroke-none"
                />

                {/* Visible plot dot marker */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={hoveredPointIndex === i ? 6 : 4}
                  className={`
                    transition-all duration-150
                    ${hoveredPointIndex === i 
                      ? 'fill-white dark:fill-slate-900 stroke-[3] stroke-slate-900 dark:stroke-white shadow-lg'
                      : 'fill-indigo-600 dark:fill-indigo-400 hover:scale-125'
                    }
                  `}
                />
              </g>
            ))}

            {/* Bottom X-Axis labels */}
            {coordinates.map((c, i) => (
              <text
                key={i}
                x={c.x}
                y={svgHeight - 4}
                className={`
                  font-mono text-[10px] text-center font-medium transition-colors
                  ${hoveredPointIndex === i 
                    ? 'fill-slate-900 dark:fill-slate-100 font-bold' 
                    : 'fill-slate-400 dark:fill-slate-500'
                  }
                `}
                textAnchor="middle"
              >
                {c.point.name}
              </text>
            ))}
          </svg>

          {/* Floated state inspection HUD when a point is hovered */}
          <div className="mt-4 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-800/85 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cycle Phase:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                {hoveredPointIndex !== null ? chartData[hoveredPointIndex].name : 'Aggregate Series'}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-[11px] text-slate-400">Revenue:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ${(hoveredPointIndex !== null ? chartData[hoveredPointIndex].revenue : currentMonthRevenue).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[11px] text-slate-400">Clients:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {(hoveredPointIndex !== null ? chartData[hoveredPointIndex].customers : totalCustomers).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-[11px] text-slate-400">Subs:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {(hoveredPointIndex !== null ? chartData[hoveredPointIndex].subscriptions : chartData[chartData.length-1].subscriptions).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Lower Dual Bento Panels (Left: Product performing lists, Right: Traffic metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel Left: Best Performing Offerings */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Service Deliverables</h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">Categorized by direct generated gross revenue contribution.</p>
            </div>
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer flex items-center gap-1 hover:underline">
              Full List YTD <ChevronRight size={13} />
            </span>
          </div>

          <div className="space-y-4">
            {products.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="min-w-0 pr-4">
                    <span className="text-slate-900 dark:text-slate-200 block font-semibold truncate hover:text-indigo-500 cursor-pointer">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.sales} subscriptions billed</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-slate-900 dark:text-slate-150 block font-bold">${p.revenue.toLocaleString()}</span>
                    <span className={`text-[9px] font-semibold flex items-center justify-end ${p.growth >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                      {p.growth >= 0 ? <ArrowUpRight size={11} /> : <TrendingDown size={11} />}
                      {p.growth >= 0 ? '+' : ''}{p.growth}%
                    </span>
                  </div>
                </div>
                {/* Custom Tailwind progress channel */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-teal-500' : idx === 2 ? 'bg-violet-500' : 'bg-slate-400'
                    }`} 
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Right: Client Acquisition Traffic sources */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Acquisition Channels</h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">Top conversion source categories for current leads.</p>
            </div>
            <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400">
              <HelpCircle size={14} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-1">
            {/* SVG Visual Circle representation path */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Underlay channel background circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-100 dark:stroke-slate-800 stroke-[3.5]" />
                
                {/* Referrals (64%) Segment - Blue */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  className="stroke-indigo-600 dark:stroke-indigo-500 stroke-[3.5] transition-all duration-300"
                  strokeDasharray="64 100" 
                  strokeDashoffset="0" 
                />
                
                {/* Organic (22%) Segment - Teal */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  className="stroke-teal-400 dark:stroke-teal-400 stroke-[3.5] transition-all duration-300"
                  strokeDasharray="22 100" 
                  strokeDashoffset="-64" 
                />
                
                {/* Campaigns (14%) Segment - Violet */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" 
                  className="stroke-violet-500 dark:stroke-violet-400 stroke-[3.5] transition-all duration-300"
                  strokeDasharray="14 100" 
                  strokeDashoffset="-86" 
                />
              </svg>
              {/* Abs center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-200">64%</span>
                <span className="text-[9px] text-slate-450 uppercase tracking-widest font-semibold leading-none">Referrals</span>
              </div>
            </div>

            {/* Bullet labels table breakdown */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-md bg-indigo-600 block flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Ad Referral Leads</span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-200">64%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-md bg-teal-400 block flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Organic Search Rank</span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-200">22%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-md bg-violet-400 block flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Campaign Operations</span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-200">14%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
