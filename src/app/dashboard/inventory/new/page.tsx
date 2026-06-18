'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { Plus, Upload, X, Package, DollarSign, AlertCircle } from 'lucide-react';
import { createProduct, getCategories } from '@/lib/actions/inventory';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    buyingPrice: '',
    sellingPrice: '',
    stockQuantity: '',
    minStockLevel: '10',
    unit: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        ...formData,
        buyingPrice: parseFloat(formData.buyingPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: parseInt(formData.minStockLevel),
      });
      router.push('/dashboard/inventory');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <DashboardHeader title="Add New Product" userRole="admin" />
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-[2.5rem] shadow-lg border border-border p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-8 w-1.5 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-semibold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-semibold outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-semibold outline-none resize-none"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Pricing & Revenue</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Buying Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.buyingPrice}
                      onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-black outline-none text-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Selling Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-black outline-none text-xl text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-8 w-1.5 bg-orange-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Inventory Control</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Min Stock Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                      Measurement Unit *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. kg, pcs, box"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Expiry & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-8 w-1.5 bg-rose-500 rounded-full"></div>
                    <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Logistics</h3>
                  </div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl focus:ring-2 focus:ring-ring/10 focus:bg-background transition-all text-foreground font-bold outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="mb-[2.75rem]"></div> {/* Spacer to align with Expiry */}
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    SKU (Auto-generated)
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Will be generated on save"
                    className="w-full px-5 py-4 bg-secondary/50 border-none rounded-2xl text-muted-foreground font-bold outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full md:w-auto px-10 py-4 text-muted-foreground font-black hover:text-foreground transition-colors uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <div className="h-6 w-6 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-6 w-6" />
                      <span>SAVE PRODUCT</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
