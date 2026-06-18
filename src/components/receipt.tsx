'use client';

import { Printer, Download, Share2, Store, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ReceiptProps {
  sale: any;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export function Receipt({ sale, storeName = 'SmartMart Pro', storeAddress = 'Terminal 01, Lagos HQ', storePhone = '+234 800 SMART MART' }: ReceiptProps) {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 no-print">
      {/* Visual Confirmation Header */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="h-20 w-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Transaction Complete</h2>
          <p className="text-muted-foreground font-medium">Digital authentication successful. Receipt generated.</p>
        </div>
      </div>

      <div className="bg-card p-10 lg:p-12 rounded-[3rem] shadow-xl border border-border max-w-xl mx-auto relative overflow-hidden" id="receipt">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-[5rem]"></div>
        
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary/10 rounded-full mb-6">
            <Store className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{storeName}</span>
          </div>
          <h1 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-2">Digital Receipt</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{storeAddress} • {storePhone}</p>
        </div>

        {/* Audit Trail */}
        <div className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-dashed border-border">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Receipt Identifier</p>
              <p className="text-sm font-black text-foreground">{sale.saleNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Execution Date</p>
              <p className="text-sm font-black text-foreground">{formatDate(sale.createdAt)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Authorized By</p>
              <p className="text-sm font-black text-foreground">{sale.cashierId?.name || 'SYSTEM'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Client Entity</p>
              <p className="text-sm font-black text-primary">{sale.customerName || 'WALK-IN CLIENT'}</p>
            </div>
          </div>
        </div>

        {/* Itemized Manifest */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-1 w-4 bg-primary rounded-full"></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Itemized Manifest</h3>
          </div>
          <div className="space-y-4">
            {sale.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center group">
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{item.productName}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{item.quantity} units @ {formatCurrency(item.sellingPrice)}</p>
                </div>
                <p className="text-sm font-black text-foreground">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Settlement */}
        <div className="bg-secondary/50 p-8 rounded-3xl space-y-4 border border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-muted-foreground">Gross Total</span>
            <span className="font-black text-foreground">{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-muted-foreground">Loyalty Rebate</span>
              <span className="font-black text-destructive">-{formatCurrency(sale.discount)}</span>
            </div>
          )}
          {sale.tax > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-muted-foreground">Fiscal Levy</span>
              <span className="font-black text-foreground">{formatCurrency(sale.tax)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-border flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Settlement</p>
              <span className="text-sm font-bold text-muted-foreground capitalize">{sale.paymentMethod} Payment</span>
            </div>
            <span className="text-3xl font-black text-primary tracking-tight">{formatCurrency(sale.total)}</span>
          </div>
          
          {sale.paymentMethod === 'cash' && (
            <div className="pt-4 mt-4 border-t border-border flex justify-between items-center text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Received</span>
                <span className="text-foreground font-black">{formatCurrency(sale.cashReceived)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Refund/Change</span>
                <span className="text-emerald-600 font-black">{formatCurrency(sale.change)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Integrity Check */}
        <div className="mt-12 text-center">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 italic">Official Document Integrity Validated</p>
          <div className="h-12 w-32 border-2 border-border rounded-xl mx-auto flex items-center justify-center opacity-30">
            <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em]">SECURE ID</span>
          </div>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex flex-wrap justify-center gap-4 no-print max-w-xl mx-auto">
        <button
          onClick={handlePrint}
          className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          <Printer className="h-4 w-4" />
          <span>Commit Print</span>
        </button>
        <button className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-6 py-4 bg-card border border-border text-muted-foreground rounded-2xl font-black shadow-sm hover:bg-secondary transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Download className="h-4 w-4" />
          <span>Export PDF</span>
        </button>
        <button className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-6 py-4 bg-card border border-border text-muted-foreground rounded-2xl font-black shadow-sm hover:bg-secondary transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Share2 className="h-4 w-4" />
          <span>Distribute</span>
        </button>
      </div>
    </div>
  );
}
