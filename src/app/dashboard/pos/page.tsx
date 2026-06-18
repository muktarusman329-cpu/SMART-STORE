'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Search, Scan, Plus, Minus, Trash2, CreditCard, DollarSign, Smartphone, Printer, ShoppingCart, Phone, User, Mail } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'paystack'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = 0;
  const discount = 0;
  const total = subtotal - discount + tax;
  const change = parseFloat(cashReceived) - total;

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchProducts(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const lookupCustomer = async (phone: string) => {
    if (phone.length < 10) return;

    try {
      const response = await fetch(`/api/customers/lookup?phone=${phone}`);
      const data = await response.json();

      if (data.success && data.data) {
        setCustomer(data.data);
        setCustomerName(data.data.name || '');
        setCustomerEmail(data.data.email || '');
        setCustomerAddress(data.data.address || '');
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerPhone) {
        lookupCustomer(customerPhone);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customerPhone]);

  const searchProducts = async (query: string) => {
    try {
      const response = await fetch(`/api/pos/search?q=${query}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product._id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.sellingPrice,
        quantity: 1,
        total: product.sellingPrice,
      }]);
    }

    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity, total: newQuantity * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (paymentMethod === 'cash' && parseFloat(cashReceived) < total) {
      alert('Insufficient cash received');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/pos/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone,
          customerName,
          customerEmail,
          customerAddress,
          customerId: customer?._id,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod,
          cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : total,
          notes: '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Sale completed successfully!');
        setCart([]);
        setCustomerPhone('');
        setCustomerName('');
        setCustomerEmail('');
        setCustomerAddress('');
        setCustomer(null);
        setCashReceived('');
        // TODO: Show receipt
      } else {
        alert('Error completing sale: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error completing sale');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const response = await fetch(`/api/pos/barcode/${barcode}`);
      const data = await response.json();

      if (data.success && data.data) {
        addToCart(data.data);
      } else {
        alert('Product not found');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <DashboardHeader title="Point of Sale" userRole="cashier" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Product Search */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name, SKU, or barcode..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={() => {
                    const barcode = prompt('Enter barcode:');
                    if (barcode) handleBarcodeScan(barcode);
                  }}
                  className="flex items-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
                >
                  <Scan className="h-5 w-5" />
                  <span className="font-bold">Scan</span>
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => addToCart(product)}
                      className="group p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all duration-300"
                    >
                      {product.images?.[0] && (
                        <div className="overflow-hidden rounded-xl mb-3 h-24">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</h4>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{product.sku}</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-2">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Beverages', 'Snacks', 'Dairy', 'Groceries', 'Personal Care', 'Household', 'Electronics', 'Others'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchQuery(category)}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all text-center group"
                >
                  <p className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Cart */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 h-fit sticky top-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Shopping Cart</h3>

            {/* Customer Info */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
                {customer && (
                  <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Returning Customer</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{customer.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{customer.loyaltyPoints} loyalty points • {formatCurrency(customer.totalSpent)} total spent</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in customer"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <ShoppingCart className="h-10 w-10 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <p className="text-slate-400 dark:text-slate-600 font-medium">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-tighter">{item.sku}</p>
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[2rem]">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500 dark:text-slate-400">Discount</span>
                <span className="text-rose-500">-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500 dark:text-slate-400">Tax</span>
                <span className="text-slate-900 dark:text-white">{formatCurrency(tax)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span className="text-lg font-black text-slate-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-8">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cash', icon: DollarSign, label: 'Cash' },
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'transfer', icon: Smartphone, label: 'Transfer' },
                  { id: 'paystack', icon: Smartphone, label: 'Paystack' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all active:scale-95",
                      paymentMethod === method.id 
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400" 
                        : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <method.icon className="h-5 w-5" />
                    <span className="font-bold text-sm">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Received Input */}
            {paymentMethod === 'cash' && (
              <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Cash Received
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white text-xl font-black outline-none"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                </div>
                {parseFloat(cashReceived) >= total && (
                  <div className="mt-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Change to return</p>
                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(change)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Printer className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  <span>COMPLETE SALE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
