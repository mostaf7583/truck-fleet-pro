import { DollarSign, TrendingUp, Truck, Users, Route, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTripsTable } from '@/components/dashboard/RecentTripsTable';
import { ProfitChart } from '@/components/dashboard/ProfitChart';
import { FleetStatus } from '@/components/dashboard/FleetStatus';
import { calculateDashboardStats, mockTrips } from '@/data/mockData';

export default function Dashboard() {
  const stats = calculateDashboardStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your fleet overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 12.5, isPositive: true }}
          className="animate-slide-up"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 8.2, isPositive: true }}
          className="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        />
        <StatCard
          title="Active Trucks"
          value={stats.activeTrucks}
          icon={Truck}
          className="animate-slide-up"
          style={{ animationDelay: '200ms' }}
        />
        <StatCard
          title="Available Drivers"
          value={stats.availableDrivers}
          icon={Users}
          className="animate-slide-up"
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          icon={Route}
          variant="accent"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Pending Payments"
          value={`$${stats.pendingPayments.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
        <FleetStatus />
      </div>

      {/* Recent Trips */}
      <RecentTripsTable trips={mockTrips.slice(0, 5)} />
    </div>
  );
}
