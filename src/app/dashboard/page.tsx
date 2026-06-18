import { auth } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard-header';
import { KPICard } from '@/components/kpi-card';
import { DashboardCharts } from '@/components/dashboard-charts';
import { getDashboardStats, getSalesData } from '@/lib/actions/dashboard';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Users,
  Wallet,
  Bell
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();
  const salesData = await getSalesData('monthly');

  return (
    <div className="min-h-screen transition-colors duration-300">
      <DashboardHeader title="Executive Overview" userRole={session?.user.role || 'cashier'} />
      
      <main className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <KPICard
            title="Today's Revenue"
            value={formatCurrency(stats.todayRevenue)}
            change={`${stats.todaySalesCount} sales today`}
            icon={DollarSign}
            iconColor="text-emerald-600"
          />
          <KPICard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            change={`${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}% vs last month`}
            changeType={stats.revenueChange >= 0 ? 'positive' : 'negative'}
            icon={TrendingUp}
            iconColor="text-blue-600"
          />
          <KPICard
            title="Active Inventory"
            value={stats.totalProducts}
            change={`${stats.lowStockProducts} items low`}
            changeType="negative"
            icon={Package}
            iconColor="text-purple-600"
          />
          <KPICard
            title="Net Profit"
            value={formatCurrency(stats.totalProfit)}
            change={`Expenses: ${formatCurrency(stats.totalExpenses)}`}
            icon={Wallet}
            iconColor="text-indigo-600"
          />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <KPICard
            title="Restock Required"
            value={stats.lowStockProducts}
            change="Critical stock levels"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-orange-600"
          />
          <KPICard
            title="Expiry Risk"
            value={stats.expiringProducts}
            change="Expiring < 15 days"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-rose-600"
          />
          <KPICard
            title="Loyal Customers"
            value={stats.totalCustomers}
            change="Registered base"
            icon={Users}
            iconColor="text-teal-600"
          />
        </div>

        {/* Charts */}
        <div className="mb-12">
          <DashboardCharts salesData={salesData} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-[2.5rem] shadow-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-border">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Recent Transactions</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Real-time update from all terminals</p>
            </div>
            <button className="px-6 py-3 bg-secondary text-muted-foreground font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all text-sm uppercase tracking-widest">
              Export Log
            </button>
          </div>
          <div className="overflow-x-auto text-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Customer / Entity</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Authorized By</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Net Amount</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Method</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentTransactions.map((transaction: any) => (
                  <tr key={transaction._id} className="group hover:bg-muted/50 transition-colors">
                    <td className="py-6 px-8">
                      <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{transaction.saleNumber}</span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                          {(transaction.customerName || 'WI').substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-foreground">{transaction.customerName || 'Walk-in Customer'}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-xs font-bold text-muted-foreground">{transaction.cashierId?.name || 'Automated'}</span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-sm font-black text-foreground">{formatCurrency(transaction.total)}</span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-xs font-bold text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
