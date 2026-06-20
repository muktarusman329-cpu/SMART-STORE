'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  Wallet, 
  BarChart3, 
  Bell, 
  Scan, 
  Brain, 
  Store, 
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSidebarProps {
  userRole: string;
  userName?: string;
}

export function DashboardSidebar({ userRole, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'cashier'] },
    { name: 'Inventory Ledger', href: '/dashboard/inventory', icon: Package, roles: ['admin', 'manager'] },
    { name: 'POS Terminal', href: '/dashboard/pos', icon: Scan, roles: ['admin', 'manager', 'cashier'] },
    { name: 'Revenue Intel', href: '/dashboard/sales', icon: BarChart3, roles: ['admin', 'manager'] },
    { name: 'Digital Fulfilment', href: '/dashboard/online-orders', icon: ShoppingCart, roles: ['admin', 'manager'] },
    { name: 'Social Commerce', href: '/dashboard/whatsapp-orders', icon: MessageSquare, roles: ['admin', 'manager'] },
    { name: 'WhatsApp Messages', href: '/dashboard/whatsapp-messages', icon: MessageSquare, roles: ['admin', 'manager'] },
    { name: 'Supply Chain', href: '/dashboard/suppliers', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Human Capital', href: '/dashboard/employees', icon: Users, roles: ['admin'] },
    { name: 'Customer Base', href: '/dashboard/customers', icon: Users, roles: ['admin', 'manager'] },
    { name: 'Expenditure', href: '/dashboard/expenses', icon: Wallet, roles: ['admin', 'manager'] },
    { name: 'Node Network', href: '/dashboard/branches', icon: Store, roles: ['admin'] },
    { name: 'System Alerts', href: '/dashboard/notifications', icon: Bell, roles: ['admin', 'manager', 'cashier'] },
    { name: 'Optical Scanner', href: '/dashboard/barcode', icon: Scan, roles: ['admin', 'manager', 'cashier'] },
    { name: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Brain, roles: ['admin', 'manager'] },
    { name: 'AI Forecasts', href: '/dashboard/ai-predictions', icon: Layers, roles: ['admin', 'manager'] },
    { name: 'System Control', href: '/dashboard/settings', icon: Settings, roles: ['admin', 'manager'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole));

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "group relative flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 mb-1",
          isActive
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "text-muted-foreground hover:bg-accent hover:text-primary"
        )}
      >
        <item.icon className={cn(
          "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )} />
        <span className="flex-1 tracking-tight">{item.name}</span>
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-full ml-1"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <ChevronRight className={cn(
          "h-4 w-4 opacity-0 transition-all duration-300 transform translate-x-2 group-hover:opacity-40 group-hover:translate-x-0",
          isActive && "hidden"
        )} />
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-card border border-border rounded-xl shadow-xl active:scale-95 transition-transform"
      >
        {isOpen ? <X className="h-6 w-6 text-muted-foreground" /> : <Menu className="h-6 w-6 text-muted-foreground" />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-500 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Brand Identity */}
          <div className="flex items-center px-2 mb-10">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter uppercase leading-none">SmartMart</h1>
              <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mt-0.5">Enterprise</p>
            </div>
          </div>

          {/* Navigation Engine */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            <div className="space-y-1">
              {filteredNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* User Control Node */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center p-3 bg-secondary/50 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer group">
              <div className="relative mr-3 flex-shrink-0">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                  {(userName || userRole).charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-card rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate uppercase tracking-tight">{userName || 'Administrator'}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
