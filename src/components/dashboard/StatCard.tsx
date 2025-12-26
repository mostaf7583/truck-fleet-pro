import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { CSSProperties } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  className?: string;
  style?: CSSProperties;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-gradient-primary text-primary-foreground',
  success: 'bg-gradient-success text-success-foreground',
  warning: 'bg-gradient-warning text-warning-foreground',
  accent: 'bg-accent text-accent-foreground',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-success-foreground/20 text-success-foreground',
  warning: 'bg-warning-foreground/20 text-warning-foreground',
  accent: 'bg-accent-foreground/20 text-accent-foreground',
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  style,
  className 
}: StatCardProps) {
  const isGradient = variant !== 'default';

  return (
    <div 
      style={style}
      className={cn(
        "relative overflow-hidden rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            isGradient ? "text-current opacity-80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className="font-display text-3xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive 
                ? isGradient ? "text-current" : "text-success" 
                : isGradient ? "text-current" : "text-destructive"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className={cn("font-normal", isGradient ? "opacity-70" : "text-muted-foreground")}>
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative element */}
      {isGradient && (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current opacity-10" />
      )}
    </div>
  );
}
