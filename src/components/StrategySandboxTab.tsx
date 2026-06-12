/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  Zap, 
  Download, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  ArrowRight,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { ChartDataPoint, Customer } from '../types';

interface StrategySandboxTabProps {
  chartData: ChartDataPoint[];
  customers: Customer[];
}

interface SavedScenario {
  id: string;
  name: string;
  adSpend: number;
  cac: number;
  organicSignups: number;
  churnRate: number;
  avgBilling: number;
}

export default function StrategySandboxTab({ chartData, customers }: StrategySandboxTabProps) {
  // Slider states
  const [adSpend, setAdSpend] = useState<number>(3500); // monthly budget in USD
  const [cac, setCac] = useState<number>(120); // customer acquisition cost in USD
  const [organicSignups, setOrganicSignups] = useState<number>(85); // free signups monthly
  const [churnRate, setChurnRate] = useState<number>(3.5); // monthly churn percentage
  const [avgBilling, setAvgBilling] = useState<number>(45); // average customer monthly bill in USD
  
  // Scenarios saving
  const [customScenarios, setCustomScenarios] = useState<SavedScenario[]>([
    {
      id: 'default-organic',
      name: 'Organic Stability Play',
      adSpend: 500,
      cac: 75,
      organicSignups: 100,
      churnRate: 2.5,
      avgBilling: 40
    },
    {
      id: 'default-paid',
      name: 'Aggressive Outbound Campaign',
      adSpend: 8000,
      cac: 180,
      organicSignups: 60,
      churnRate: 4.0,
      avgBilling: 75
    }
  ]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeInitiative, setActiveInitiative] = useState<string | null>(null);

  // Growth formulas recursive projection
  const currentInitialCustomers = useMemo(() => {
    return customers.filter(c => c.status === 'Active').length || 150;
  }, [customers]);

  const mathematicalProjection = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let userCount = currentInitialCustomers;
    const historyPoints: { name: string; users: number; revenue: number; netProfit: number }[] = [];

    // Calculate simulated month-by-month projection
    for (let i = 0; i < 12; i++) {
      const activeOutflow = Math.round(userCount * (churnRate / 100));
      const adInflow = cac > 0 ? Math.round(adSpend / cac) : 0;
      const totalInflow = organicSignups + adInflow;
      
      userCount = Math.max(0, userCount + totalInflow - activeOutflow);
      const calculatedRevenue = userCount * avgBilling;
      const netProfit = calculatedRevenue - adSpend;

      historyPoints.push({
        name: months[i],
        users: userCount,
        revenue: calculatedRevenue,
        netProfit: netProfit
      });
    }

    return historyPoints;
  }, [currentInitialCustomers, adSpend, cac, organicSignups, churnRate, avgBilling]);

  // Derived Business Core Indicators
  const finalSummaryIndicators = useMemo(() => {
    const endPoint = mathematicalProjection[11] || { users: 0, revenue: 0, netProfit: 0 };
    const initialRev = currentInitialCustomers * avgBilling;
    
    // SaaS Indicators
    const clientLifetimeMonths = churnRate > 0 ? (100 / churnRate) : 120;
    const ltvVal = Math.round(avgBilling * clientLifetimeMonths);
    const ltvToCacRatio = cac > 0 ? parseFloat((ltvVal / cac).toFixed(1)) : 10;
    
    const revenueGrowthRate = initialRev > 0 ? Math.round(((endPoint.revenue - initialRev) / initialRev) * 100) : 0;
    const projectedArr = endPoint.revenue * 12;
    const paybackPeriodMonths = avgBilling > 0 ? parseFloat((cac / avgBilling).toFixed(1)) : 0;

    return {
      finalUsers: endPoint.users,
      finalMonthlyRev: endPoint.revenue,
      finalNetProfit: endPoint.netProfit,
      ltv: ltvVal,
      ltvRatio: ltvToCacRatio,
      growthRatePercent: revenueGrowthRate,
      arr: projectedArr,
      cacPayback: paybackPeriodMonths
    };
  }, [mathematicalProjection, currentInitialCustomers, churnRate, avgBilling, cac]);

  // Preset initiative triggers (Tactical Strategy Actions)
  const applyInitiative = (id: string) => {
    if (activeInitiative === id) {
      // Revert to baseline defaults
      setAdSpend(3500);
      setCac(120);
      setOrganicSignups(85);
      setChurnRate(3.5);
      setAvgBilling(45);
      setActiveInitiative(null);
      return;
    }

    setActiveInitiative(id);
    if (id === 'referral') {
      // Referral boost
      setOrganicSignups(140);
      setCac(105); // CAC goes down slightly due to warm user referral conversions
      setChurnRate(2.8); // Referral clients are generally stickier
    } else if (id === 'annual') {
      // Switch annual billing discount strategy
      setAvgBilling(38); // 15% discount
      setChurnRate(1.6); // Massive churn reduction!
    } else if (id === 'enterprise') {
      // High-Ticket Enterprise focus shift
      setAvgBilling(140); // Lift average pricing
      setCac(350); // Massive sales cycles outlay
      setAdSpend(5000);
      setOrganicSignups(20); // Organic signups slow as professional tier gets gated
    }
  };

  // Helper selectors and ratios
  const ltvBadgeDetails = (ratio: number) => {
    if (ratio >= 4.0) return { label: 'Elite Unit Economics', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (ratio >= 3.0) return { label: 'Healthy SaaS Target', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
    if (ratio >= 1.5) return { label: 'Modest / Invest Wisely', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'Unviable Ad Model', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  };

  const handleSaveScenario = () => {
    if (!newScenarioName.trim()) return;
    const toSave: SavedScenario = {
      id: `saved-${Date.now()}`,
      name: newScenarioName.trim(),
      adSpend,
      cac,
      organicSignups,
      churnRate,
      avgBilling
    };
    setCustomScenarios(prev => [...prev, toSave]);
    setNewScenarioName('');
  };

  const handleApplySavedScenario = (sc: SavedScenario) => {
    setAdSpend(sc.adSpend);
    setCac(sc.cac);
    setOrganicSignups(sc.organicSignups);
    setChurnRate(sc.churnRate);
    setAvgBilling(sc.avgBilling);
    setActiveInitiative('custom-preset');
  };

  const handleDeleteSavedScenario = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomScenarios(prev => prev.filter(sc => sc.id !== id));
  };

  // SVG Projection Plot helpers
  const svgWidth = 500;
  const svgHeight = 160;
  const maxSimulatedValue = Math.max(...mathematicalProjection.map(p => p.revenue), 1000);
  
  const getSvgCoordinates = (): string => {
    return mathematicalProjection.reduce((pathString, point, index) => {
      const x = (index / 11) * (svgWidth - 20) + 10;
      const y = svgHeight - 15 - ((point.revenue / maxSimulatedValue) * (svgHeight - 35));
      return pathString + `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }, '');
  };

  const getSvgFillCoordinates = (): string => {
    const linePath = getSvgCoordinates();
    if (!linePath) return '';
    const firstX = 10;
    const lastX = (11 / 11) * (svgWidth - 20) + 10;
    const bottomY = svgHeight - 15;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight flex items-center gap-2">
            <Sliders className="text-indigo-600 dark:text-indigo-400" size={20} />
            Growth Sandbox & Strategy Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Simulate marketing outlay, churn retention loops, and packaging models below to forecast lifetime customer yields.
          </p>
        </div>

        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={() => {
              setAdSpend(3500);
              setCac(120);
              setOrganicSignups(85);
              setChurnRate(3.5);
              setAvgBilling(45);
              setActiveInitiative(null);
            }}
            className="px-3.5 py-1.5 rounded-xl border border-white/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-350 hover:bg-white/80 dark:hover:bg-slate-900/80 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Reset sandbox defaults"
          >
            <RotateCcw size={13} />
            Reset Baseline
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-950/20"
          >
            <Download size={13} />
            Save Proposal
          </button>
        </div>
      </div>

      {/* 2. Primary layout grids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Interactive Control Board (Sliders) */}
        <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 xl:col-span-2 space-y-6">
          
          {/* Growth tactical triggers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5 font-mono">
              <Zap size={12} className="text-amber-500 h-3.5" />
              Strategic Initiative Simulation Preset
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => applyInitiative('referral')}
                className={`py-3 px-3.5 rounded-2xl border text-left transition-all ${
                  activeInitiative === 'referral' 
                    ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-650' 
                    : 'bg-white/40 dark:bg-slate-950/20 hover:bg-white/80 dark:hover:bg-slate-900/40 border-white/30 dark:border-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${activeInitiative === 'referral' ? 'bg-white/20 text-white' : 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400'}`}>Viral</span>
                  {activeInitiative === 'referral' && <span className="text-[10px] ml-auto">✓ Active</span>}
                </div>
                <h4 className="text-xs font-bold leading-tight">Referral Loop Engine</h4>
                <p className={`text-[9px] mt-1.5 ${activeInitiative === 'referral' ? 'text-indigo-200' : 'text-slate-400'}`}>+55 Growth, lowered overall CAC</p>
              </button>

              <button
                type="button"
                onClick={() => applyInitiative('annual')}
                className={`py-3 px-3.5 rounded-2xl border text-left transition-all ${
                  activeInitiative === 'annual' 
                    ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-650' 
                    : 'bg-white/40 dark:bg-slate-950/20 hover:bg-white/80 dark:hover:bg-slate-900/40 border-white/30 dark:border-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${activeInitiative === 'annual' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400'}`}>Retention</span>
                  {activeInitiative === 'annual' && <span className="text-[10px] ml-auto">✓ Active</span>}
                </div>
                <h4 className="text-xs font-bold leading-tight">Annual Discount Push</h4>
                <p className={`text-[9px] mt-1.5 ${activeInitiative === 'annual' ? 'text-indigo-200' : 'text-slate-400'}`}>-15% Fee, cuts Churn rate by 55%</p>
              </button>

              <button
                type="button"
                onClick={() => applyInitiative('enterprise')}
                className={`py-3 px-3.5 rounded-2xl border text-left transition-all ${
                  activeInitiative === 'enterprise' 
                    ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-650' 
                    : 'bg-white/40 dark:bg-slate-950/20 hover:bg-white/80 dark:hover:bg-slate-900/40 border-white/30 dark:border-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${activeInitiative === 'enterprise' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-500'}`}>Value</span>
                  {activeInitiative === 'enterprise' && <span className="text-[10px] ml-auto">✓ Active</span>}
                </div>
                <h4 className="text-xs font-bold leading-tight">Enterprise Shift Hub</h4>
                <p className={`text-[9px] mt-1.5 ${activeInitiative === 'enterprise' ? 'text-indigo-200' : 'text-slate-400'}`}>Whale contracts, but raises CAC significantly</p>
              </button>
            </div>
          </div>

          <hr className="border-white/20 dark:border-slate-800/20" />

          {/* Interactive Sliders Board */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <Sliders size={12} className="text-indigo-400" />
              SaaS Operational Input Variables
            </h3>

            {/* Slider 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="flex items-center gap-1">Ad Acquisition Outlay</span>
                <span className="font-mono text-indigo-655 dark:text-indigo-405 bg-indigo-50 dark:bg-slate-950/50 px-2 py-0.5 rounded-md border border-indigo-100/30 dark:border-slate-800">
                  ${adSpend.toLocaleString()}/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={adSpend}
                onChange={(e) => {
                  setAdSpend(parseInt(e.target.value));
                  if (activeInitiative !== 'custom-preset') setActiveInitiative(null);
                }}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                <span>$0</span>
                <span>$10,000</span>
                <span>$25,000 Max</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="flex items-center gap-1">Client Outlay CAC (Cost to Acquire)</span>
                <span className="font-mono text-indigo-655 dark:text-indigo-455 bg-indigo-50 dark:bg-slate-950/50 px-2 py-0.5 rounded-md border border-indigo-100/30 dark:border-slate-800">
                  ${cac}/client
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="5"
                value={cac}
                onChange={(e) => {
                  setCac(parseInt(e.target.value));
                  if (activeInitiative !== 'custom-preset') setActiveInitiative(null);
                }}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                <span>$30</span>
                <span>$250</span>
                <span>$500 Max</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="flex items-center gap-1">Unpaid Organic Intake Rate</span>
                <span className="font-mono text-indigo-655 dark:text-indigo-405 bg-indigo-50 dark:bg-slate-950/50 px-2 py-0.5 rounded-md border border-indigo-100/30 dark:border-slate-800">
                  +{organicSignups} signup/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="5"
                value={organicSignups}
                onChange={(e) => {
                  setOrganicSignups(parseInt(e.target.value));
                  if (activeInitiative !== 'custom-preset') setActiveInitiative(null);
                }}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                <span>0 signups</span>
                <span>200 signups</span>
                <span>400/mo Max</span>
              </div>
            </div>

            {/* Slider 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="flex items-center gap-1">Client Base Churn Percentage</span>
                <span className="font-mono text-indigo-655 dark:text-indigo-405 bg-indigo-50 dark:bg-slate-950/50 px-2 py-0.5 rounded-md border border-indigo-100/30 dark:border-slate-800">
                  {churnRate}% churn/mo
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={churnRate}
                onChange={(e) => {
                  setChurnRate(parseFloat(e.target.value));
                  if (activeInitiative !== 'custom-preset') setActiveInitiative(null);
                }}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                <span>0.5% (Very Stick)</span>
                <span>7.5%</span>
                <span>15.0% Churn Max</span>
              </div>
            </div>

            {/* Slider 5 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="flex items-center gap-1">Average Contract Billable Rate</span>
                <span className="font-mono text-indigo-655 dark:text-indigo-405 bg-indigo-50 dark:bg-slate-950/50 px-2 py-0.5 rounded-md border border-indigo-100/30 dark:border-slate-800">
                  ${avgBilling} USD/mo
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={avgBilling}
                onChange={(e) => {
                  setAvgBilling(parseInt(e.target.value));
                  if (activeInitiative !== 'custom-preset') setActiveInitiative(null);
                }}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                <span>$10</span>
                <span>$150</span>
                <span>$300/mo Max</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Columns: Metrics outputs & SVGs projection plots */}
        <div className="space-y-6">
          
          {/* Output KPIs side visual panels */}
          <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Live Projected Outputs (Month 12)
            </h3>

            {/* Profit margin board */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/50 border border-white/40 dark:border-slate-850/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">Monthly Net Income</span>
                <span className={`text-xl font-black font-sans ${finalSummaryIndicators.finalNetProfit >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  ${finalSummaryIndicators.finalNetProfit.toLocaleString()}/mo
                </span>
                <p className="text-[9px] text-slate-400 mt-1">Acquisition outlay subtracted and simulated</p>
              </div>
              <div className={`p-2.5 rounded-xl ${finalSummaryIndicators.finalNetProfit >= 0 ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'}`}>
                <DollarSign size={16} />
              </div>
            </div>

            {/* LTV:CAC Unit Economics Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/50 border border-white/40 dark:border-slate-850/30 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">LTV : CAC Ratio</span>
                  <span className="text-xl font-bold text-slate-905 dark:text-slate-100 font-mono">
                    {finalSummaryIndicators.ltvRatio}x
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ltvBadgeDetails(finalSummaryIndicators.ltvRatio).color}`}>
                  {ltvBadgeDetails(finalSummaryIndicators.ltvRatio).label}
                </span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    finalSummaryIndicators.ltvRatio >= 3.0 ? 'bg-teal-555 dark:bg-teal-400' :
                    finalSummaryIndicators.ltvRatio >= 1.5 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (finalSummaryIndicators.ltvRatio / 5) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-slate-400 leading-snug font-medium pt-0.5">
                <span>Projected Client Life: LTV ${finalSummaryIndicators.ltv}</span>
                <span>CAC Payback: {finalSummaryIndicators.cacPayback} mo</span>
              </div>
            </div>

            {/* ARR Milestone */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/50 border border-white/40 dark:border-slate-850/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">Projected Run-rate ARR</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-sans tracking-tight text-indigo-650 dark:text-indigo-400">
                  ${finalSummaryIndicators.arr.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center">
                  +{finalSummaryIndicators.growthRatePercent}% Change
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                Scale trajectory projections over next 12 sequential months under simulated inputs.
              </p>
            </div>

          </div>

          {/* Graphic Projection curve using inline SVGs */}
          <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-909 dark:text-slate-100 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" />
                Monthly Revenue Projection Course
              </span>
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">
                Peak: ${Math.round(maxSimulatedValue).toLocaleString()}
              </span>
            </div>

            <div className="relative bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 p-2 overflow-hidden">
              <svg className="w-full h-40 overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="strategyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Simulated vertical indicator lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => {
                  const x = (index / 11) * (svgWidth - 20) + 10;
                  return (
                    <line 
                      key={index}
                      x1={x} 
                      y1="10" 
                      x2={x} 
                      y2={svgHeight - 15} 
                      stroke="#64748b" 
                      strokeWidth="1" 
                      strokeDasharray="2,5" 
                      strokeOpacity="0.15" 
                    />
                  );
                })}

                {/* Simulated revenue curve polygon */}
                <path 
                  d={getSvgFillCoordinates()} 
                  fill="url(#strategyGrad)" 
                />
                
                {/* Simulated revenue line */}
                <path 
                  d={getSvgCoordinates()} 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Bullet milestone plot circles */}
                {mathematicalProjection.map((point, index) => {
                  if (index % 3 !== 0 && index !== 11) return null;
                  const x = (index / 11) * (svgWidth - 20) + 10;
                  const y = svgHeight - 15 - ((point.revenue / maxSimulatedValue) * (svgHeight - 35));
                  return (
                    <g key={index} className="group/dot">
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="3.5" 
                        fill="#4f46e5" 
                        stroke="#ffffff" 
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Linear labels */}
              <div className="flex justify-between px-2 pt-0.5 font-mono text-[9px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800/40">
                <span>Month 1</span>
                <span>Month 4</span>
                <span>Month 7</span>
                <span>Month 10</span>
                <span>Month 12</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-450 dark:text-slate-400 text-center flex items-center justify-center gap-1.5">
              <span>Total customers Month 12: <strong className="text-slate-805 dark:text-slate-205">{finalSummaryIndicators.finalUsers}</strong> active users.</span>
            </p>
          </div>

        </div>

      </div>

      {/* 3. Custom saved projections scenario shelf */}
      <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[40px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-909 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Layers size={16} className="text-indigo-500" />
          Projections Scenario Comparisons Storage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Form to quick save current coordinates */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/20 border border-white/20 dark:border-slate-800/20 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Store Active Sandbox Settings</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Scenario label (e.g., Target B)..."
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                maxLength={40}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-902 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSaveScenario}
                className="p-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white transition-colors"
                title="Save scenario"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Quick list of saved coordinate files */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
            {customScenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => handleApplySavedScenario(sc)}
                className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-950/20 hover:bg-white/85 dark:hover:bg-slate-900/60 cursor-pointer border border-white/20 dark:border-slate-800/20 hover:border-indigo-150 dark:hover:border-indigo-900 transition-all flex items-start justify-between gap-2 group"
              >
                <div className="space-y-1">
                  <h5 className="text-[11px] font-bold text-slate-903 dark:text-slate-100 group-hover:text-indigo-650 dark:group-hover:text-indigo-400">
                    {sc.name}
                  </h5>
                  <div className="flex gap-2 text-[9px] text-slate-400 font-mono leading-tight flex-wrap">
                    <span>Ad: ${sc.adSpend}</span>
                    <span>CAC: ${sc.cac}</span>
                    <span>Churn: {sc.churnRate}%</span>
                    <span>Bill: ${sc.avgBilling}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteSavedScenario(sc.id, e)}
                  className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex-shrink-0"
                  title="Remove saved preset"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 4. Display Report Export Modal panel */}
      {showExportModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[32px] max-w-lg w-full border border-white/60 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/85 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-905 dark:text-slate-100 flex items-center gap-1.5">
                <FileText size={16} className="text-indigo-500" />
                Scenario Strategic Expansion Memo
              </h3>
              <button 
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl font-mono text-left text-[10px] text-slate-600 dark:text-slate-350 space-y-3 whitespace-pre-wrap leading-relaxed">
                {`EXPANSION MODEL PROPOSAL - CONFIDENTIAL
Host Ref: AD-2026-06 / Admin Suite
Report compiled UTC: 2026-06-05

1. CURRENT SIMULATION PARAMETERS
- Ad Outlay Budget / Month: $${adSpend.toLocaleString()}
- Client Acquisition Cost (CAC): $${cac}
- Base Organic Client Vol: +${organicSignups}/mo
- Simulated Client Churn Vol: ${churnRate}%/mo
- Target Monthly Fee Average: $${avgBilling}

2. PROJECTED Y1 BUSINESS MILESTONES
- Cumulativeactive Customers (Month 12): ${finalSummaryIndicators.finalUsers} Active Users
- Final Simulated Monthly SaaS Revenue: $${finalSummaryIndicators.finalMonthlyRev.toLocaleString()}/mo
- Projected Enterprise ARR Run-rate: $${finalSummaryIndicators.arr.toLocaleString()}/yr
- Monthly Net Profit margin outcome: $${finalSummaryIndicators.finalNetProfit.toLocaleString()}/mo

3. UNIT ECONOMICS AND LTV HEALTH ASSESSMENT
- Projected Client Lifetime Value (LTV): $${finalSummaryIndicators.ltv}
- LTV : CAC Ad Multiple Grade: ${finalSummaryIndicators.ltvRatio}x
- Grade Classification: ${ltvBadgeDetails(finalSummaryIndicators.ltvRatio).label}
- Payback Conversion cycle time: ${finalSummaryIndicators.cacPayback} Months

MEMO REPORT SIGNED / ADMIN TEAM`}
              </div>

              <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 rounded-xl flex items-start gap-2.5">
                <CheckCircle size={15} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Proposal compiled successfully! Copy or log this memo text-block directly to save structural scenarios into executive decks.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-150 dark:border-slate-800/80 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-505 dark:text-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 font-bold transition-all"
              >
                Close View
              </button>
              
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`EXPANSION MODEL PROPOSAL - CONFIDENTIAL\nHost Ref: AD-2026-06 / Admin Suite\nReport compiled UTC: 2026-06-05\n\n1. CURRENT SIMULATION PARAMETERS\n- Ad Outlay Budget / Month: $${adSpend.toLocaleString()}\n- Client Acquisition Cost (CAC): $${cac}\n- Base Organic Client Vol: +${organicSignups}/mo\n- Simulated Client Churn Vol: ${churnRate}%/mo\n- Target Monthly Fee Average: $${avgBilling}\n\n2. PROJECTED Y1 BUSINESS MILESTONES\n- Cumulative active Customers (Month 12): ${finalSummaryIndicators.finalUsers} Active Users\n- Final Simulated Monthly SaaS Revenue: $${finalSummaryIndicators.finalMonthlyRev.toLocaleString()}/mo\n- Projected Enterprise ARR Run-rate: $${finalSummaryIndicators.arr.toLocaleString()}/yr\n- Monthly Net Profit margin outcome: $${finalSummaryIndicators.finalNetProfit.toLocaleString()}/mo\n\n3. UNIT ECONOMICS AND LTV HEALTH ASSESSMENT\n- Projected Client Lifetime Value (LTV): $${finalSummaryIndicators.ltv}\n- LTV : CAC Ad Multiple Grade: ${finalSummaryIndicators.ltvRatio}x\n\nMEMO REPORT SIGNED / ADMIN TEAM`);
                  alert("Memo copied to clipboard!");
                }}
                className="px-4 py-2 rounded-xl text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-bold transition-all"
              >
                Copy Memo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
