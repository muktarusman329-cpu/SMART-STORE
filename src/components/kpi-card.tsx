import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  iconColor = 'text-blue-600'
}: KPICardProps) {
  return (
    <div className="group bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-baseline space-x-1">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{value}</h2>
          </div>
          {change && (
            <div className="flex items-center mt-4">
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[12px] font-bold inline-flex items-center",
                changeType === 'positive' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
                changeType === 'negative' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : 
                "bg-secondary text-muted-foreground"
              )}>
                {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-xl transition-all duration-500 group-hover:scale-110 shadow-sm",
          iconColor.replace('text-', 'bg-').replace('-600', '-500/20'),
          "bg-secondary",
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
