/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  ShieldCheck, 
  Calendar,
  Layers,
  Sparkles,
  X,
  Check,
  Trash2,
  Clock,
  Inbox
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import AnalyticsTab from './components/AnalyticsTab';
import CustomersTab from './components/CustomersTab';
import StrategySandboxTab from './components/StrategySandboxTab';
import SettingsTab from './components/SettingsTab';
import { ActiveTab, ChartDataPoint, Customer } from './types';
import { initialChartData, initialProductsPerformance, initialCustomers } from './data';

const getGradientClass = (id: string) => {
  switch (id) {
    case 'indigo': return 'from-indigo-600 to-violet-600';
    case 'emerald': return 'from-teal-500 to-emerald-605';
    case 'sunset': return 'from-rose-500 to-orange-500';
    case 'blue':
    default:
      return 'from-blue-505 to-blue-650';
  }
};

const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return 'M';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'strategy' | 'customer' | 'conversion' | 'system';
}

export default function App() {
  // Navigation & Sizing layouts
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to gorgeous dark mode as 2026 SaaS trend

  // User Profile configuration states
  const [profileName, setProfileName] = useState('Milad M');
  const [profileEmail, setProfileEmail] = useState('miladmo68@gmail.com');
  const [profileRole, setProfileRole] = useState('Milink Partner');
  const [profileGradient, setProfileGradient] = useState('blue');

  // Notification center interactive states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Strategy Plan Prepared',
      description: 'Your growth scenarios and revenue forecasts for Q3 are saved and ready to run.',
      time: '2 mins ago',
      read: false,
      type: 'strategy'
    },
    {
      id: '2',
      title: 'New Customer Acquired',
      description: 'Acme Corp subscribed to Enterprise plan ($2,400/yr). Added to your CRM.',
      time: '1 hour ago',
      read: false,
      type: 'customer'
    },
    {
      id: '3',
      title: 'High Conversion Spike',
      description: 'Organic customer conversion escalated to 4.8% after pricing adaptations.',
      time: '4 hours ago',
      read: true,
      type: 'conversion'
    },
    {
      id: '4',
      title: 'Regional Audit Synchronized',
      description: 'European union node database successfully replicated with zero latency.',
      time: '1 day ago',
      read: true,
      type: 'system'
    }
  ]);

  // Operational states
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialChartData);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [quickFilter, setQuickFilter] = useState<'7d' | '30d' | 'ytd'>('ytd');

  // Trigger Tailwind Theme DOM switches
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // CRM Add/Delete Handlers
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Filtered Chart data simulation
  const getFilteredChartData = () => {
    if (quickFilter === '7d') {
      // Show May/Jun scale and scale revenue slightly to adjust
      return chartData.slice(-2).map(p => ({
        ...p,
        revenue: Math.round(p.revenue * 0.22),
        customers: Math.round(p.customers * 0.1),
        subscriptions: Math.round(p.subscriptions * 0.12)
      }));
    }
    if (quickFilter === '30d') {
      // Last 4 months scaled down slightly for 30d views
      return chartData.slice(-4).map(p => ({
        ...p,
        revenue: Math.round(p.revenue * 0.95),
        customers: Math.round(p.customers * 0.96),
        subscriptions: Math.round(p.subscriptions * 0.94)
      }));
    }
    return chartData; // YTD scale
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] bg-[radial-gradient(at_top_right,_#e0e7ff_0%,_transparent_50%),radial-gradient(at_bottom_left,_#fef2f2_0%,_transparent_50%)] dark:bg-slate-950 dark:bg-[radial-gradient(at_top_right,_#1e1b4b_0%,_transparent_50%),radial-gradient(at_bottom_left,_#140505_0%,_transparent_50%)] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
      
      {/* 1. Sidebar Navigation Left Panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        profileName={profileName}
        profileEmail={profileEmail}
        profileRole={profileRole}
        profileGradient={profileGradient}
      />

      {/* 2. Main Terminal Right Segment */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navigation bar with high z-index and solid opaque background styles */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/95 dark:bg-slate-950/95 border-b border-slate-250 dark:border-slate-800/65 flex-shrink-0 z-50">
          
          {/* Header Left (Mobile menu or title) */}
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Toggle navigation links"
            >
              <Menu size={18} />
            </button>

            {/* Custom dynamic title tag */}
            <div className="flex items-center gap-2 hidden sm:flex">
              <Layers size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 dark:text-slate-450 font-mono">
                System Active
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Header Center (Dummy platform status info) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
            <Calendar size={13} className="text-slate-400" />
            <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
              Live Scale UTC: 2026-06-04
            </span>
          </div>

          {/* Header Right indicators */}
          <div className="flex items-center gap-4">
            
            {/* Quick help button */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 dev-indicator dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800/50">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="font-semibold text-[10px]">Cloud Connected</span>
            </div>

            {/* Notification alert container with relative positioning */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
                aria-label="Toggle notification inbox"
                id="notification-bell-btn"
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 animate-pulse" />
                )}
              </button>

              {/* Frosted Glass Dropdown Panel */}
              {showNotifications && (
                <>
                  {/* Invisible backdrop helper targeting close triggers */}
                  <div 
                    className="fixed inset-0 z-[9998]" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  
                  <div className="absolute right-0 mt-3.5 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-2xl shadow-indigo-950/10 dark:shadow-black/60 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-850/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-sans">Notifications</span>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono font-bold rounded-full">
                          {notifications.filter(n => !n.read).length} Unread
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            }}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-1 py-0.5 rounded"
                          >
                            Mark All Read
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => setShowNotifications(false)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/55">
                      {notifications.length === 0 ? (
                        <div className="py-8 px-4 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-550 gap-2">
                          <Inbox size={28} className="text-slate-300 dark:text-slate-700" />
                          <p className="text-xs font-semibold">All caught up!</p>
                          <p className="text-[10px] text-slate-400 max-w-[180px]">No new system notices right now.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3.5 flex items-start justify-between gap-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-950/40 cursor-pointer ${!notif.read ? 'bg-indigo-50/15 dark:bg-indigo-950/10' : ''}`}
                            onClick={() => {
                              // Mark as read on click
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                            }}
                          >
                            <div className="flex gap-2.5 flex-1">
                              {/* Visual bullet symbol by type */}
                              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notif.type === 'strategy' ? 'bg-amber-500' :
                                notif.type === 'customer' ? 'bg-indigo-650' :
                                notif.type === 'conversion' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`} />
                              <div className="space-y-0.5 text-left">
                                <h4 className="text-[11px] font-bold text-slate-950 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
                                  {notif.title}
                                  {!notif.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                  )}
                                </h4>
                                <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-medium">
                                  {notif.description}
                                </p>
                                <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono pt-1">
                                  <Clock size={10} /> {notif.time}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNotifications(prev => prev.filter(n => n.id !== notif.id));
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded transition-colors self-center flex-shrink-0"
                              title="Delete notification"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setNotifications([]);
                          }}
                          className="w-full text-center text-[10px] font-bold text-slate-450 hover:text-slate-650 dark:hover:text-slate-250 py-1 transition-colors"
                        >
                          Clear All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Visual spacer line */}
            <span className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:inline" />

            {/* Workspace quick profile view */}
            <button 
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all text-left cursor-pointer focus:outline-none"
              title="View Profile Settings"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getGradientClass(profileGradient)} text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs border border-white dark:border-slate-800 hidden sm:flex select-none`}>
                {getInitials(profileName)}
              </div>
              <div className="text-left hidden lg:block leading-none">
                <p className="text-xs font-bold text-slate-850 dark:text-slate-100 leading-tight truncate max-w-[140px]">{profileName}</p>
                <span className="text-[9px] text-[#0070ff] dark:text-blue-450 font-mono font-bold uppercase tracking-wide block mt-1">{profileRole}</span>
              </div>
            </button>

          </div>

        </header>

        {/* Dynamic page render slot */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab 
                chartData={getFilteredChartData()}
                products={initialProductsPerformance}
                quickFilter={quickFilter}
                setQuickFilter={setQuickFilter}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab 
                quickFilter={quickFilter}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersTab 
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {activeTab === 'strategy' && (
              <StrategySandboxTab 
                chartData={chartData}
                customers={customers}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab 
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                profileRole={profileRole}
                setProfileRole={setProfileRole}
                profileGradient={profileGradient}
                setProfileGradient={setProfileGradient}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}
