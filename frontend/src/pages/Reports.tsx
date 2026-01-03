import { useState, useMemo } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { trucksApi, tripsApi, tripIncomeApi, tripExpenseApi, fuelApi, maintenanceApi } from '@/lib/api';
import { Truck as TruckType, Trip, TripIncome, TripExpense, FuelRecord, MaintenanceRecord } from '@/types';

export default function Reports() {
  const [period, setPeriod] = useState<string>('monthly');
  const { toast } = useToast();

  // Fetch all necessary data
  const { data: trucks = [] } = useQuery<TruckType[]>({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  const { data: trips = [] } = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });

  const { data: incomes = [] } = useQuery<TripIncome[]>({
    queryKey: ['incomes'],
    queryFn: tripIncomeApi.getAll,
  });

  const { data: expenses = [] } = useQuery<TripExpense[]>({
    queryKey: ['expenses'],
    queryFn: tripExpenseApi.getAll,
  });

  const { data: fuelRecords = [] } = useQuery<FuelRecord[]>({
    queryKey: ['fuelRecords'],
    queryFn: fuelApi.getAll,
  });

  const { data: maintenanceRecords = [] } = useQuery<MaintenanceRecord[]>({
    queryKey: ['maintenanceRecords'],
    queryFn: maintenanceApi.getAll,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    // Helper to get month name
    const getMonthName = (dateStr: string | Date) => {
      const date = new Date(dateStr);
      return date.toLocaleString('ar-EG', { month: 'long' });
    };

    // Helper to get month index for sorting
    const getMonthIndex = (dateStr: string | Date) => {
      return new Date(dateStr).getMonth();
    };

    // Initialize monthly data structure
    const monthlyStats: Record<string, { monthIndex: number; revenue: number; expenses: number; profit: number }> = {};

    // Process Incomes (Revenue) - Use dueDate
    incomes.forEach(income => {
      const month = getMonthName(income.dueDate);
      const index = getMonthIndex(income.dueDate);
      if (!monthlyStats[month]) monthlyStats[month] = { monthIndex: index, revenue: 0, expenses: 0, profit: 0 };
      monthlyStats[month].revenue += income.amount;
    });

    // Process Expenses - Use date
    const processExpense = (amount: number, date: string | Date) => {
      const month = getMonthName(date);
      const index = getMonthIndex(date);
      if (!monthlyStats[month]) monthlyStats[month] = { monthIndex: index, revenue: 0, expenses: 0, profit: 0 };
      monthlyStats[month].expenses += amount;
    };

    expenses.forEach(e => processExpense(e.amount, e.date));
    fuelRecords.forEach(f => processExpense(f.cost, f.date));
    maintenanceRecords.forEach(m => processExpense(m.cost, m.date));

    // Calculate Profit & Format for Chart
    const monthlyData = Object.entries(monthlyStats)
      .map(([month, data]) => ({
        month,
        ...data,
        profit: data.revenue - data.expenses
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex);

    // Calculate Totals
    const totalRevenue = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalFuelCost = fuelRecords.reduce((sum, f) => sum + f.cost, 0);
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0);
    const totalTripExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = totalFuelCost + totalMaintenanceCost + totalTripExpenses;
    const totalProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

    return { monthlyData, totalRevenue, totalExpenses, totalProfit, profitMargin };
  }, [incomes, expenses, fuelRecords, maintenanceRecords]);

  // Calculate Profit per Truck
  const truckStats = useMemo(() => {
    return trucks.map(truck => {
      const truckTrips = trips.filter(t => t.truckId === truck.id);
      const tripIds = truckTrips.map(t => t.id);

      const truckIncome = incomes
        .filter(i => tripIds.includes(i.tripId))
        .reduce((sum, i) => sum + i.amount, 0);

      const truckFuelCost = fuelRecords
        .filter(f => f.truckId === truck.id)
        .reduce((sum, f) => sum + f.cost, 0);

      const truckMaintenanceCost = maintenanceRecords
        .filter(m => m.truckId === truck.id)
        .reduce((sum, m) => sum + m.cost, 0);

      const truckTripExpenses = expenses
        .filter(e => tripIds.includes(e.tripId))
        .reduce((sum, e) => sum + e.amount, 0);

      const totalExpenses = truckFuelCost + truckMaintenanceCost + truckTripExpenses;
      const profit = truckIncome - totalExpenses;

      return {
        id: truck.id,
        name: truck.plateNumber,
        model: truck.model,
        income: truckIncome,
        expenses: totalExpenses,
        profit,
        trips: truckTrips.length,
      };
    });
  }, [trucks, trips, incomes, expenses, fuelRecords, maintenanceRecords]);

  const handleExport = () => {
    const headers = ['Month', 'Revenue', 'Expenses', 'Profit'];
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + stats.monthlyData.map(row => `${row.month},${row.revenue},${row.expenses},${row.profit}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "financial_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'تم تصدير التقرير',
      description: 'تم تحميل ملف التقرير بنجاح.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">التقارير المالية</h1>
          <p className="text-muted-foreground">تحليل الأداء المالي للأسطول</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="ml-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="quarterly">ربع سنوي</SelectItem>
              <SelectItem value="yearly">سنوي</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="font-display text-2xl font-bold" dir="ltr">{stats.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
              <p className="font-display text-2xl font-bold" dir="ltr">{stats.totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">صافي الربح</p>
              <p className={`font-display text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`} dir="ltr">
                {stats.totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">هامش الربح</p>
              <p className="font-display text-2xl font-bold" dir="ltr">{stats.profitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expenses Bar Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-semibold">الإيرادات مقابل المصروفات</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    textAlign: 'right'
                  }}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
                    name === 'Revenue' ? 'الإيرادات' : 'المصروفات'
                  ]}
                />
                <Bar dataKey="revenue" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Line Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-semibold">اتجاه الأرباح</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    textAlign: 'right'
                  }}
                  formatter={(value: number) => [value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }), 'الربح']}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2 }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profit per Truck */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="font-display text-lg font-semibold">الربح لكل شاحنة</h3>
          <p className="text-sm text-muted-foreground">تفاصيل الأداء المالي لكل مركبة</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الشاحنة</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الرحلات</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الدخل</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">المصروفات</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الربح</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الهامش</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {truckStats.map((truck, index) => {
                const margin = truck.income > 0 ? ((truck.profit / truck.income) * 100).toFixed(1) : '0';

                return (
                  <tr
                    key={truck.id}
                    className="transition-colors hover:bg-muted/20 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{truck.name}</p>
                          <p className="text-sm text-muted-foreground">{truck.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {truck.trips}
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {truck.income.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 font-medium text-destructive">
                      {truck.expenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                    </td>
                    <td className={`px-4 py-3 font-bold ${truck.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {truck.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 font-medium" dir="ltr">
                      {margin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
