'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Save, Store, Bell, Shield, CreditCard, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Store },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'online', name: 'Online Store', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="System Settings" userRole="admin" />
      
      <main className="p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">General Configuration</h3>
                      <p className="text-sm font-medium text-slate-500">Global system parameters and identity.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Store Identity</label>
                      <input
                        type="text"
                        defaultValue="SmartMart Pro"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Support Email</label>
                      <input
                        type="email"
                        defaultValue="contact@smartmart.com"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Base Currency</label>
                      <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none appearance-none">
                        <option>NGN (₦)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Default Tax Rate (%)</label>
                      <input
                        type="number"
                        defaultValue="7.5"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button className="flex items-center space-x-2 px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
                      <Save className="h-5 w-5" />
                      <span>SAVE CHANGES</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab !== 'general' && (
                <div className="py-20 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.name} Settings</h3>
                  <p className="text-gray-500">This section is currently under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
