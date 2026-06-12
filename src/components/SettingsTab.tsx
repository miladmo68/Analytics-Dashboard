/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Palette, 
  Save, 
  Check, 
  Sparkles, 
  Globe, 
  Shield, 
  Laptop,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface SettingsTabProps {
  profileName: string;
  setProfileName: (name: string) => void;
  profileEmail: string;
  setProfileEmail: (email: string) => void;
  profileRole: string;
  setProfileRole: (role: string) => void;
  profileGradient: string;
  setProfileGradient: (gradient: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function SettingsTab({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profileRole,
  setProfileRole,
  profileGradient,
  setProfileGradient,
  darkMode,
  setDarkMode
}: SettingsTabProps) {
  // Local form states
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);
  const [tempRole, setTempRole] = useState(profileRole);
  const [tempGradient, setTempGradient] = useState(profileGradient);
  
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Gradient themes based on Toronto digital visual strategies
  const gradientPresets = [
    { id: 'blue', name: 'Milink Electric Blue', class: 'from-blue-500 to-blue-600', text: 'from-[#0070ff] to-[#0055cc]' },
    { id: 'indigo', name: 'Royal Toronto Purple', class: 'from-indigo-600 to-violet-600', text: 'from-indigo-600 to-violet-600' },
    { id: 'emerald', name: 'High-Conversion Emerald', class: 'from-teal-500 to-emerald-600', text: 'from-teal-500 to-emerald-600' },
    { id: 'sunset', name: 'Velocity Crimson', class: 'from-rose-500 to-orange-500', text: 'from-rose-500 to-orange-500' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setProfileName(tempName);
      setProfileEmail(tempEmail);
      setProfileRole(tempRole);
      setProfileGradient(tempGradient);
      
      setIsSaving(false);
      setShowToast(true);
      
      // Auto-hide success toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 450);
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return 'M';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const activeGrad = gradientPresets.find(g => g.id === tempGradient) || gradientPresets[0];

  return (
    <div className="space-y-6">
      {/* Dynamic Success Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[10005] bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1 rounded-full bg-white/20">
            <CheckCircle size={16} />
          </div>
          <div className="text-left font-sans">
            <h4 className="text-xs font-bold leading-none">Settings Synchronized Successfully</h4>
            <p className="text-[10px] text-emerald-100 mt-1">Profile data and branding refreshed live across all nodes.</p>
          </div>
        </div>
      )}

      {/* Hero Welcome Cover */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/90 to-indigo-600 dark:from-indigo-950/80 dark:to-slate-900/80 text-white p-6 sm:p-8 rounded-[32px] border border-blue-500/10 dark:border-slate-800/50 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Active User Avatar Dynamic display */}
            <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${activeGrad.class} text-white font-mono flex items-center justify-center font-bold text-xl shadow-xl ring-4 ring-white/10`}>
              {getInitials(tempName)}
            </div>
            <div className="space-y-1">
              <span className="bg-white/15 dark:bg-indigo-505/20 text-white dark:text-blue-300 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/15">
                Corporate Authority Mode
              </span>
              <h3 className="text-xl font-bold tracking-tight mt-1">{tempName || 'Anonymous Partner'}</h3>
              <p className="text-[11px] text-blue-100/80 dark:text-slate-400 font-mono font-medium">
                {tempEmail} • {tempRole}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 dark:border-slate-800/30 text-right text-xs">
              <span className="text-[9px] text-blue-100 font-bold block mb-1">AGENCY PROVIDER</span>
              <a href="https://milink.ca" target="_blank" rel="noreferrer" className="font-bold flex items-center gap-1 hover:underline text-white">
                Milink Toronto <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Form Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Settings Panel */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg">
          <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50 tracking-tight flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <User size={15} className="text-[#0070ff]" />
            Personal & Professional Identity
          </h3>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            
            {/* Real-time Name field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Full Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Milad Partner"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium font-sans"
                  required
                />
              </div>
              <p className="text-[9px] text-slate-400">This updates the desktop header and active system logs in real-time.</p>
            </div>

            {/* Real-time Email field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="e.g. info@milink.ca"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium font-sans"
                  required
                />
              </div>
              <p className="text-[9px] text-slate-400">Used for notification delivery endpoints, web audits, and billing reports.</p>
            </div>

            {/* Real-time Role / Corporate Title field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Corporate Executive Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  type="text"
                  value={tempRole}
                  onChange={(e) => setTempRole(e.target.value)}
                  placeholder="e.g. Milink Architect"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium font-sans"
                  required
                />
              </div>
              <p className="text-[9px] text-slate-400">Configures authorization permissions on strategy metrics.</p>
            </div>

            {/* Submit save button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#0070ff] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2 select-none disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    Apply New Configuration
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: Visual Theme Customizer & Info */}
        <div className="space-y-6">
          
          {/* Brand Colors Preset Card */}
          <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg">
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-50 tracking-tight flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <Palette size={15} className="text-[#0070ff]" />
              Studio Brand Customization
            </h3>

            <div className="mt-5 space-y-4">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Choose a gradient signature preset below to customize your executive profile visual style.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {gradientPresets.map((g) => {
                  const isSelected = tempGradient === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTempGradient(g.id)}
                      className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-50 dark:bg-slate-950/40 border-[#0070ff] ring-2 ring-blue-500/10' 
                          : 'bg-transparent border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-950/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${g.class} shadow-sm`} />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{g.name}</span>
                      </div>
                      {isSelected && <Check size={14} className="text-[#0070ff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secure Environment Audit */}
          <div className="bg-white/60 dark:bg-slate-900/45 backdrop-blur-md p-5 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg text-left space-y-3.5">
            <h4 className="text-xs font-bold text-slate-950 dark:text-slate-50 flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-500" />
              Corporate Audit Security status
            </h4>
            
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">HTTPS Encryption Protocol</span>
                <span className="font-bold text-emerald-555">Active</span>
              </div>
              
              <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Vapor Data Synchronizer</span>
                <span className="font-bold text-blue-505">Balanced</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              Any changes to credentials conform strictly with GDPR and local privacy standard checks provided by <strong>Milink Studio specialists</strong>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
