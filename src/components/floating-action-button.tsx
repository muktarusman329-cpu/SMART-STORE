'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, Package, Users, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: ShoppingCart, label: 'New Sale', href: '/dashboard/pos', color: 'bg-emerald-500' },
    { icon: Package, label: 'Add Product', href: '/dashboard/inventory/new', color: 'bg-blue-500' },
    { icon: Users, label: 'New Customer', href: '/dashboard/customers/new', color: 'bg-purple-500' },
    { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/ai-assistant', color: 'bg-indigo-500' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse items-end mb-4 space-y-reverse space-y-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center group"
                >
                  <span className="mr-3 px-3 py-1 bg-card border border-border rounded-lg text-sm font-semibold text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {action.label}
                  </span>
                  <div className={`${action.color} p-3 rounded-2xl text-white shadow-lg hover:scale-110 transition-transform active:scale-95`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${isOpen ? 'bg-secondary' : 'bg-primary'} p-4 rounded-3xl text-primary-foreground shadow-2xl shadow-primary/20 flex items-center justify-center transition-colors`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Plus className="h-8 w-8" />
        </motion.div>
      </motion.button>
    </div>
  );
}
