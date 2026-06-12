/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Sliders, 
  Moon, 
  Sun, 
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Laptop,
  Settings,
  ChevronsUpDown,
  ShieldCheck,
  Bell,
  LogOut,
  User
} from 'lucide-react';
import { ActiveTab } from '../types';
import { MilinkLogo } from './MilinkLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  profileName: string;
  profileEmail: string;
  profileRole: string;
  profileGradient: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  darkMode,
  setDarkMode,
  profileName,
  profileEmail,
  profileRole,
  profileGradient
}: SidebarProps) {
  // Collapse state for desktop views - cached in localStorage for persistent state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('milink-sidebar-collapsed') === 'true';
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const getGradientClass = (id: string) => {
    switch (id) {
      case 'indigo': return 'from-indigo-600 to-violet-600';
      case 'emerald': return 'from-teal-500 to-emerald-600';
      case 'sunset': return 'from-rose-500 to-orange-500';
      case 'blue':
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return 'M';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('milink-sidebar-collapsed', String(nextState));
  };

  const menuItems = [
    { 
      id: 'overview' as ActiveTab, 
      label: 'Overview', 
      icon: LayoutDashboard, 
      desc: 'Key performance hub' 
    },
    { 
      id: 'analytics' as ActiveTab, 
      label: 'Analytics', 
      icon: LineChart, 
      desc: 'Advanced statistics' 
    },
    { 
      id: 'customers' as ActiveTab, 
      label: 'Customers', 
      icon: Users, 
      desc: 'CRM list directory' 
    },
    { 
      id: 'strategy' as ActiveTab, 
      label: 'Strategy Hub', 
      icon: Sliders, 
      desc: 'Sandbox Growth Simulator' 
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation Panel with dynamic desktop width based on collapse state */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col justify-between 
        bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-r border-white/40 dark:border-slate-800/35 shadow-lg
        transform transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0 w-68' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-68'}
      `}>
        {/* Upper Sidebar Brand & Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className={`h-16 flex items-center border-b border-white/40 dark:border-slate-800/35 transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-6 justify-between'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Premium Milink vector branding logo */}
              <MilinkLogo className="w-9 h-9 flex-shrink-0" />
              
              {!isCollapsed && (
                <div className="transition-opacity duration-300 animate-in fade-in truncate">
                  <h1 className="font-sans font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-none truncate">
                    Milink Hub
                  </h1>
                  <span className="font-mono text-[9px] text-[#0070ff] dark:text-blue-400 font-bold uppercase tracking-wider block mt-1 hover:underline">
                    milink.ca
                  </span>
                </div>
              )}
            </div>
            
            {/* Action buttons (Collapse on desktop, Close on mobile drawer) */}
            <div className="flex items-center gap-1">
              {/* Collapse Trigger button for Desktop only */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-lg transition-colors cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              {/* Close Button on Mobile Drawer */}
              <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Strategy Sandbox Banner - hidden if collapsed to look pristine */}
          {!isCollapsed ? (
            <div className="p-4 mx-4 mt-4 rounded-xl bg-blue-50/40 dark:bg-slate-900/40 backdrop-blur-md border border-blue-100/30 dark:border-slate-800/40 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#0070ff] text-white mt-0.5">
                  <Laptop size={12} className="animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold text-slate-850 dark:text-slate-200 leading-none">
                    Milink Creation
                  </h2>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1.5 leading-snug font-medium">
                    Designed and built by Milink Toronto Web Design Agency.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 animate-pulse" title="Milink Project">
                <Laptop size={14} />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-5 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center rounded-xl transition-all duration-200 text-left group relative
                    ${isCollapsed 
                      ? 'justify-center p-3' 
                      : 'gap-3.5 px-4 py-3'
                    }
                    ${isActive 
                      ? 'bg-white/80 dark:bg-slate-900/80 text-[#0070ff] dark:text-blue-450 font-bold shadow-xs border border-blue-105/45 dark:border-slate-800/40' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <div className={`
                    p-1.5 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0070ff] dark:text-blue-400' 
                      : 'bg-transparent text-slate-450 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                    }
                  `}>
                    <Icon size={18} />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="min-w-0 transition-all duration-200">
                      <p className="text-sm font-semibold leading-none">{item.label}</p>
                      <span className="text-[10px] text-slate-400 font-normal mt-0.5 block opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.desc}
                      </span>
                    </div>
                  )}

                  {/* Collapse Hover Tooltip */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-slate-900/95 dark:bg-slate-900/95 text-white text-xs font-semibold rounded-xl shadow-2xl border border-slate-800/90 pointer-events-none group-hover:translate-x-1.5 group-hover:opacity-100 opacity-0 transition-all duration-200 whitespace-nowrap z-50">
                      <div className="font-bold text-slate-50">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{item.desc}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Configuration Toggle & Footer */}
        <div className="p-4 border-t border-white/30 dark:border-slate-800/30 space-y-3 bg-white/10 dark:bg-slate-950/15 transition-all duration-300 relative">
          
          {/* Simulated Sign-Out Overlay */}
          {showLogoutAlert && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[99999] animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-3xl">
                <div className="w-12 h-12 rounded-full bg-rose-550/10 text-rose-500 flex items-center justify-center mx-auto text-xl animate-bounce">
                  <LogOut size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Signed out of Milink Hub</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Your executive credentials and secure sandbox keys have been parked safely.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutAlert(false);
                    setShowDropdown(false);
                  }}
                  className="w-full py-2.5 bg-[#0070ff] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Re-Authenticate Session
                </button>
              </div>
            </div>
          )}

          {/* Theme Switcher Toggle */}
          <div className={`flex items-center rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/40 shadow-2xs transition-all duration-300 ${isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'}`}>
            {!isCollapsed && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 pl-1.5 flex items-center gap-1.5">
                {darkMode ? <Moon size={11} className="text-blue-400" /> : <Sun size={11} className="text-amber-500" />}
                {darkMode ? 'DARK' : 'LIGHT'}
              </span>
            )}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer group relative"
              aria-label="Toggle visual theme"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-5 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity whitespace-nowrap z-50">
                  {darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                </div>
              )}
            </button>
          </div>

          {/* Interactive User profile block with popup select dropdown */}
          <div className="relative">
            
            {/* Popover Dropdown Menu element (rests above the card, z-9999 above everything) */}
            {showDropdown && (
              <>
                {/* Click outside shield overlay to close dropdown */}
                <div 
                  className="fixed inset-0 z-[9995]" 
                  onClick={() => setShowDropdown(false)}
                />
                
                <div className={`absolute bottom-full mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[22px] shadow-2xl shadow-indigo-950/15 dark:shadow-black/75 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 text-left ${
                  isCollapsed ? 'left-0 w-60' : 'left-0 right-0'
                } z-[9999]`}>
                  {/* Dropdown Header user card */}
                  <div className="p-3 flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getGradientClass(profileGradient)} text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs border border-white dark:border-slate-800/50 select-none flex-shrink-0`}>
                      {getInitials(profileName)}
                    </div>
                    <div className="min-w-0 pr-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 truncate leading-tight">
                        {profileName}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5" title={profileEmail}>
                        {profileEmail}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1.5" />

                  {/* Operational tab shortcuts */}
                  <div className="space-y-0.5">
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setShowDropdown(false);
                      }}
                      className={`w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                        activeTab === 'settings' 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 text-[#0070ff] dark:text-blue-400' 
                          : 'text-slate-650 dark:text-slate-300'
                      }`}
                    >
                      <User size={15} className="text-slate-450 flex-shrink-0" />
                      <span>Profile</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setShowDropdown(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-650 dark:text-slate-300 text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer text-left"
                    >
                      <ShieldCheck size={15} className="text-slate-450 flex-shrink-0" />
                      <span>Account</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        const btn = document.getElementById('notification-bell-btn');
                        if (btn) btn.click();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-650 dark:text-slate-300 text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer text-left"
                    >
                      <Bell size={15} className="text-slate-450 flex-shrink-0" />
                      <span className="flex-1 flex items-center justify-between">
                        <span>Notifications</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      </span>
                    </button>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1.5" />

                  {/* simulated logout endpoint */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShowLogoutAlert(true);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-555 font-bold text-xs flex items-center gap-3 transition-all cursor-pointer text-left"
                  >
                    <LogOut size={15} className="text-rose-500 flex-shrink-0" />
                    <span>Sign out</span>
                  </button>

                </div>
              </>
            )}

            {/* Profile trigger card wrapper */}
            {isCollapsed ? (
              <div className="flex justify-center">
                <button 
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-10 h-10 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/40 flex items-center justify-center transition-all cursor-pointer focus:outline-none relative ${
                    showDropdown ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  aria-label="User profiles and configuration menu"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${getGradientClass(profileGradient)} text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs select-none`}>
                    {getInitials(profileName)}
                  </div>
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-full bg-slate-100/85 dark:bg-slate-900/50 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-slate-200/40 dark:border-slate-800/40 p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer select-none focus:outline-none ${
                  showDropdown ? 'ring-1.5 ring-blue-500/30 border-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${getGradientClass(profileGradient)} text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs select-none flex-shrink-0`}>
                    {getInitials(profileName)}
                  </div>
                  
                  <div className="min-w-0 text-left">
                    <span className="font-sans font-bold text-[12px] text-slate-850 dark:text-slate-200 block truncate leading-tight">
                      {profileName}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5" title={profileEmail}>
                      {profileEmail}
                    </span>
                  </div>
                </div>
                
                <ChevronsUpDown size={14} className="text-slate-400 flex-shrink-0 ml-1.5" />
              </button>
            )}

          </div>

        </div>
      </aside>
    </>
  );
}
