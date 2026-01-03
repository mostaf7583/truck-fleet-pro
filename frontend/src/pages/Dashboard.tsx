import { DollarSign, TrendingUp, Truck, Users, Route, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTripsTable } from '@/components/dashboard/RecentTripsTable';
import { ProfitChart } from '@/components/dashboard/ProfitChart';
import { FleetStatus } from '@/components/dashboard/FleetStatus';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, tripsApi, driversApi, trucksApi } from '@/lib/api';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: trips } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: driversApi.getAll,
  });

  const { data: trucks } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  if (!stats || !trips || !drivers || !trucks) {
    return <div>Loading...</div>; // Simple loading state for now
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحباً بعودتك! إليك نظرة عامة على الأسطول.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={stats.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 12.5, isPositive: true }}
          className="animate-slide-up"
        />
        <StatCard
          title="صافي الربح"
          value={stats.netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 8.2, isPositive: true }}
          className="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        />
        <StatCard
          title="الشاحنات النشطة"
          value={stats.activeTrucks}
          icon={Truck}
          className="animate-slide-up"
          style={{ animationDelay: '200ms' }}
        />
        <StatCard
          title="السائقين المتاحين"
          value={stats.availableDrivers}
          icon={Users}
          className="animate-slide-up"
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="الرحلات النشطة"
          value={stats.activeTrips}
          icon={Route}
          variant="accent"
        />
        <StatCard
          title="إجمالي المصروفات"
          value={stats.totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="مدفوعات معلقة"
          value={stats.pendingPayments.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
        <FleetStatus trucks={trucks} />
      </div>

      {/* Recent Trips */}
      <RecentTripsTable trips={trips.slice(0, 5)} drivers={drivers} trucks={trucks} />
    </div>
  );
}
