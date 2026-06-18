'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Scan, Package, Search, AlertCircle, Clock } from 'lucide-react';

export default function BarcodeScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const toggleScanner = () => {
    setScanning(!scanning);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <DashboardHeader title="Optical Scanner" userRole="cashier" />
      
      <main className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_20px_50px_rgba(8,112,184,0.08)] border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-12 text-center">
              <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${scanning ? 'bg-blue-600 text-white animate-pulse shadow-2xl shadow-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <Scan className="h-14 w-14" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                {scanning ? 'SYSTEM SCANNING' : 'SCANNER READY'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm mx-auto">
                Align the product barcode within the frame to instantly retrieve inventory data and pricing.
              </p>
              
              <button
                onClick={toggleScanner}
                className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl ${
                  scanning 
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-2 border-rose-100 dark:border-rose-500/20 hover:bg-rose-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
                }`}
              >
                {scanning ? 'TERMINATE SCAN' : 'INITIATE CAMERA'}
              </button>
            </div>
            
            <div className="bg-slate-50/50 dark:bg-slate-800/30 px-10 py-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Recent Session Scans</h3>
                <button className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Flush History</button>
              </div>
              
              {lastScan ? (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{lastScan}</p>
                      <div className="flex items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Timestamped at {new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black rounded-xl hover:bg-blue-100 transition-colors uppercase tracking-widest">
                    PULL DATA
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">No active scans detected</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-start space-x-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                <Search className="h-7 w-7" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Instant Lookup</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">Zero-latency product identification for peak operational efficiency.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-start space-x-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Manual Override</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">Input digital codes directly if optical sensors fail to resolve.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
