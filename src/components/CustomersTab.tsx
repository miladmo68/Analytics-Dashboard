/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  UserCheck,
  UserX,
  MapPin,
  Mail,
  DollarSign,
  ChevronRight,
  X
} from 'lucide-react';
import { Customer } from '../types';

interface CustomersTabProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomersTab({
  customers,
  onAddCustomer,
  onDeleteCustomer
}: CustomersTabProps) {
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustTier, setNewCustTier] = useState<Customer['tier']>('Basic');
  const [newCustStatus, setNewCustStatus] = useState<Customer['status']>('Active');
  const [newCustSpend, setNewCustSpend] = useState('1500');

  // Map Filtered Dataset
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;

    const newCustomer: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustName,
      email: newCustEmail,
      tier: newCustTier,
      spend: parseFloat(newCustSpend) || 0,
      status: newCustStatus,
      dateJoined: new Date().toISOString().split('T')[0]
    };

    onAddCustomer(newCustomer);
    setSelectedCustomerId(newCustomer.id);
    
    // Clear Input Fields
    setNewCustName('');
    setNewCustEmail('');
    setNewCustTier('Basic');
    setNewCustStatus('Active');
    setNewCustSpend('1500');
    setIsModalOpen(false);
  };

  // Inspect customer info helper
  const activeCustomerInfo = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-950 dark:text-slate-100 tracking-tight">
            Customer CRM Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Browse subscriber profiles, filter engagement indexes, and provision new consumer tiers.
          </p>
        </div>

        {/* Modal open button trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-150"
        >
          <Plus size={15} /> Add Customer Record
        </button>
      </div>

      {/* Main client-side query filter input section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5">
        {/* Search SearchBar */}
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search clients by name, contact email or reference CID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-150 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Status Dropdown Box */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-150 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
        >
          <option value="All">All Engagement Levels</option>
          <option value="Active">Active status</option>
          <option value="Pending">Pending setup</option>
          <option value="Suspended">Suspended profiles</option>
        </select>
      </div>

      {/* Main Double Compartment Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Table Compartment (Left) */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 xl:col-span-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 dark:bg-slate-950/30 backdrop-blur-md border-b border-white/30 dark:border-slate-800/30 text-[10px] text-slate-450 uppercase tracking-widest font-bold">
                  <th className="py-3.5 px-4">Client Detail</th>
                  <th className="py-3.5 px-4">Account Tier</th>
                  <th className="py-3.5 px-4">Engagement</th>
                  <th className="py-3.5 px-4 text-right">Billing Spend</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium italic">
                      No customer profiles matched your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const isSelected = cust.id === selectedCustomerId;
                    return (
                      <tr 
                        key={cust.id}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className={`
                          cursor-pointer transition-colors
                          ${isSelected 
                            ? 'bg-indigo-50/40 dark:bg-slate-800/60' 
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                          }
                        `}
                      >
                        {/* Name / Email */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-150 leading-none">{cust.name}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{cust.email}</span>
                        </td>

                        {/* Account growth tier badge */}
                        <td className="py-3 px-4">
                          <span className={`
                            font-mono text-[9px] font-bold px-2 py-0.5 rounded-md
                            ${cust.tier === 'Enterprise' ? 'bg-indigo-100 text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-400' :
                              cust.tier === 'Professional' ? 'bg-teal-100 text-teal-750 dark:bg-teal-950/40 dark:text-teal-400' :
                              cust.tier === 'Developer' ? 'bg-violet-100 text-violet-750 dark:bg-violet-950/40 dark:text-violet-400' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                          `}>
                            {cust.tier}
                          </span>
                        </td>

                        {/* Status Icon */}
                        <td className="py-3 px-4">
                          <span className={`
                            inline-flex items-center gap-1.5 font-bold text-[10px]
                            ${cust.status === 'Active' ? 'text-teal-650' : 
                              cust.status === 'Pending' ? 'text-amber-600' : 'text-rose-500'}
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              cust.status === 'Active' ? 'bg-teal-500' : 
                              cust.status === 'Pending' ? 'bg-amber-550' : 'bg-rose-500'
                            }`} />
                            {cust.status}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                          ${cust.spend.toLocaleString()}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              onDeleteCustomer(cust.id);
                              if (selectedCustomerId === cust.id) {
                                setSelectedCustomerId(null);
                              }
                            }}
                            className="p-1 px-2.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete customer record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Compartment View (Right side HUD panel) */}
        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 dark:border-slate-850/40 shadow-lg shadow-indigo-950/5 space-y-5">
          {activeCustomerInfo ? (
            <>
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {activeCustomerInfo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight text-sm">
                    {activeCustomerInfo.name}
                  </h3>
                  <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">{activeCustomerInfo.id}</span>
                </div>
              </div>

              {/* Stat parameters */}
              <div className="space-y-3.5">
                {/* Parameter 1 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Communication Email</span>
                  <a href={`mailto:${activeCustomerInfo.email}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1">
                    <Mail size={12} className="text-indigo-400" />
                    {activeCustomerInfo.email}
                  </a>
                </div>

                {/* Parameter 2 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Corporate Member Since</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCustomerInfo.dateJoined}</span>
                </div>

                {/* Parameter 3 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Master Level Tier</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeCustomerInfo.tier} Plan</span>
                </div>

                {/* Parameter 4 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Direct Invoice Spend</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-sm">
                    ${activeCustomerInfo.spend.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Artificial notes box to make CRM look insanely complete */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] leading-relaxed text-slate-500">
                <span className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CRM Core Account Notes:</span>
                "Platform activity check indicates high daily usage. Client expresses growth operational interest in enterprise API. No recent support requests."
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 italic">
              Click a client table row on the left to inspect detailed profile analytics or communication pathways.
            </div>
          )}
        </div>

      </div>

      {/* 3. New Customer Creation Dialog Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          
          {/* Modal layout box */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] max-w-md w-full border border-white/60 dark:border-slate-800/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/85 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-905 dark:text-slate-100 flex items-center gap-1.5">
                <UserCheck size={16} className="text-indigo-500" />
                Add Customer Profile Record
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                title="Cancel"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
              
              {/* Field A: Full Customer Name */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-455">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Cooper-Smith"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-850 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Field B: Email */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-455">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. liam.c@nordiccorp.no"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-855 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Field C & D inside row: Account Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 dark:text-slate-455">Contract Tier</label>
                  <select
                    value={newCustTier}
                    onChange={(e) => setNewCustTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-855 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Basic">Basic Plan</option>
                    <option value="Developer">Developer API</option>
                    <option value="Professional">Professional Tier</option>
                    <option value="Enterprise">Enterprise Hub</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 dark:text-slate-455">Engagement Status</label>
                  <select
                    value={newCustStatus}
                    onChange={(e) => setNewCustStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-855 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Active">Active Setup</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Suspended">Suspended Profile</option>
                  </select>
                </div>
              </div>

              {/* Field E: Annualized Invoice Cost */}
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-slate-455">Calculated Billed Spend ($ USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={newCustSpend}
                  onChange={(e) => setNewCustSpend(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-850 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium font-mono"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-805 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-xs bg-slate-100 hover:bg-slate-150 text-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-transform"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
