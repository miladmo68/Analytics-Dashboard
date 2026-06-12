/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  LineChart, 
  Calculator, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  MapPin,
  ChevronUp
} from 'lucide-react';

interface AnalyticsTabProps {
  quickFilter: '7d' | '30d' | 'ytd';
}

export default function AnalyticsTab({ quickFilter }: AnalyticsTabProps) {
  // Region mock data statistics
  const regionalPerformance = [
    { region: 'North America', sales: 496, revenue: 74466, percentage: 50 },
    { region: 'Europe', sales: 298, revenue: 44679, percentage: 30 },
    { region: 'Asia-Pacific', sales: 149, revenue: 22339, percentage: 15 },
    { region: 'Latin America', sales: 50, revenue: 7446, percentage: 5 },
  ];

  // Device mock sessions
  const deviceSessions = [
    { type: 'Desktop Browser', ratio: 58, icon: Laptop, color: 'bg-indigo-500' },
    { type: 'Mobile Phone', ratio: 34, icon: Smartphone, color: 'bg-teal-400' },
    { type: 'Tablet Touch', ratio: 8, icon: Tablet, color: 'bg-amber-400' },
  ];

  // Interactive Forecasting Simulator State
  const [targetConversion, setTargetConversion] = useState<number>(4.8); // Percentage
  const [avgPrice, setAvgPrice] = useState<number>(150); // Dollars per subscriber
  const baselineMonthlyActive = 12480; // Stable active users

  // Calculates output: baselineMonthlyActive * (targetConversion/100) * avgPrice
  const simulatedMonthlyRevenue = baselineMonthlyActive * (targetConversion / 100) * avgPrice;
  const standardCurrentJuneRevenue = 32232;
  const deltaRevenuePercentage = ((simulatedMonthlyRevenue - standardCurrentJuneRevenue) / standardCurrentJuneRevenue) * 100;

  return (
    <div className="space-y-6">
      
      {/* Tab Header Description */}
      <div>
        <h2 className="text-xl font-bold font-sans text-slate-950 dark:text-slate-100 tracking-tight">
          Performance Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
          Breakdowns of transaction activity sorted by geo-location, client hardware setups, and revenue forecasting simulators.
        </p>
      </div>

      {/* Grid: 1. Region Bar List & 2. Device Breakout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Geographical Performance (Horizontal SVG Bar representation) */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin size={15} className="text-indigo-500" />
                Regional Revenue Performance
              </h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-400">Total metrics generated across major administrative zones.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md font-semibold">
              Live Scale
            </span>
          </div>

          {/* Geo graph drawing */}
          <div className="space-y-4 pt-1">
            {regionalPerformance.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-center text-xs text-slate-500 pr-1 mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                    {item.region}
                  </span>
                  <div className="space-x-3 text-right font-mono">
                    <span>{item.sales} sales specs</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">${item.revenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Styled Bar track */}
                <div className="w-full h-8 flex rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/35 overflow-hidden p-1">
                  <div 
                    className="h-full rounded-lg bg-gradient-to-r from-indigo-500/80 to-indigo-500 dark:from-indigo-650 dark:to-indigo-550 transition-all duration-500 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-2xs"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Sessions breakout */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Sessions by Device</h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-450">Active user browser environments.</p>
            </div>
            <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400">
              <HelpCircle size={14} />
            </div>
          </div>

          {/* Render circular visual representation bar segment blocks stacked */}
          <div className="relative h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <span className="bg-indigo-500 h-full transition-all duration-300" style={{ width: '58%' }} />
            <span className="bg-teal-400 h-full transition-all duration-300" style={{ width: '34%' }} />
            <span className="bg-amber-400 h-full transition-all duration-300" style={{ width: '8%' }} />
          </div>

          <div className="space-y-2">
            {deviceSessions.map((dev, idx) => {
              const DevIcon = dev.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/20 border border-slate-100/50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg ${dev.color} text-white`}>
                      <DevIcon size={14} />
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{dev.type}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-905 dark:text-slate-100">{dev.ratio}%</span>
                </div>
              );
            })}
          </div>

          {/* Tiny helpful tip footer */}
          <p className="text-[10px] text-slate-400 leading-normal text-center bg-indigo-50/30 dark:bg-slate-850/30 py-2 rounded-lg">
            Analytics show a **14% mobile expansion** year-over-year.
          </p>
        </div>

      </div>

      {/* 2. Interactive Tactile pricing / conversion simulation box */}
      <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-lg p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-slate-100 flex items-center gap-2">
              <Calculator size={17} className="text-indigo-500" />
              SaaS Operational Forecasting Sandbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Simulate operational billing levels. Modify target metrics around June's baseline of **12,480 active customers**.
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-indigo-100/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] uppercase flex items-center gap-1">
            <Sparkles size={11} className="animate-spin-slow" /> Sandbox Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          
          {/* Sliders Input Blocks */}
          <div className="space-y-5">
            {/* Slider 1: Conversation Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-750 dark:text-slate-300">Target Funnel Conversion</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{targetConversion}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="12.0" 
                step="0.1"
                value={targetConversion}
                onChange={(e) => setTargetConversion(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.5% (Hard Floor)</span>
                <span>Current: 4.8%</span>
                <span>12.0% (Cap Limit)</span>
              </div>
            </div>

            {/* Slider 2: Average Tier pricing cost */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-750 dark:text-slate-300">Average Contract Subscription Price</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">${avgPrice} / mo</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="450" 
                step="5"
                value={avgPrice}
                onChange={(e) => setAvgPrice(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$30 (Lite plan)</span>
                <span>Current: $150</span>
                <span>$450 (Enterprise)</span>
              </div>
            </div>
          </div>

          {/* Live Compute projection output board */}
          <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-950/60 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold">Simulated Projection Report</h4>
            
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono">
                ${Math.round(simulatedMonthlyRevenue).toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-400 font-medium">/ month</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              <span className="text-xs font-medium text-slate-500">Gross billing change vs June:</span>
              
              <span className={`
                flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-lg
                ${deltaRevenuePercentage >= 0 
                  ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400' 
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                }
              `}>
                {deltaRevenuePercentage >= 0 ? '+' : ''}{deltaRevenuePercentage.toFixed(1)}%
                {deltaRevenuePercentage >= 0 ? <TrendingUp size={13} /> : null}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 italic font-medium pt-1 border-dotted border-t border-slate-100 dark:border-slate-800">
              Formula: Active users ({baselineMonthlyActive}) × Target rate ({targetConversion}%) × Price (${avgPrice})
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
