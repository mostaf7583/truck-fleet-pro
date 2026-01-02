import { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  mockTrips,
  mockTrucks,
  mockFuelRecords,
  mockMaintenanceRecords,
  mockTripIncomes,
  mockTripExpenses
} from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Reports() {
  const [period, setPeriod] = useState<string>('monthly');

  // Calculate profit per truck
  const truckProfits = mockTrucks.map(truck => {
    const truckTrips = mockTrips.filter(t => t.truckId === truck.id);
    const tripIds = truckTrips.map(t => t.id);

    const income = mockTripIncomes
      .filter(i => tripIds.includes(i.tripId))
      .reduce((sum, i) => sum + i.amount, 0);

    const fuelCost = mockFuelRecords
      .filter(f => f.truckId === truck.id)
      .reduce((sum, f) => sum + f.cost, 0);

    const maintenanceCost = mockMaintenanceRecords
      .filter(m => m.truckId === truck.id)
      .reduce((sum, m) => sum + m.cost, 0);

    const tripExpenses = mockTripExpenses
      .filter(e => tripIds.includes(e.tripId))
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = fuelCost + maintenanceCost + tripExpenses;
    const profit = income - totalExpenses;

    return {
      id: truck.id,
      name: truck.plateNumber,
      model: truck.model,
      income,
      expenses: totalExpenses,
      profit,
      trips: truckTrips.length,
    };
  });

  // Monthly data for charts
  const monthlyData = [
    { month: 'يناير', revenue: 22500, expenses: 14200, profit: 8300 },
    { month: 'فبراير', revenue: 28000, expenses: 16800, profit: 11200 },
    { month: 'مارس', revenue: 25500, expenses: 15400, profit: 10100 },
    { month: 'أبريل', revenue: 32000, expenses: 18900, profit: 13100 },
    { month: 'مايو', revenue: 29500, expenses: 17200, profit: 12300 },
    { month: 'يونيو', revenue: 35000, expenses: 19500, profit: 15500 },
  ];

  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

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
          <Button variant="outline" className="gap-2">
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
              <p className="font-display text-2xl font-bold">{totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
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
              <p className="font-display text-2xl font-bold">{totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
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
              <p className="font-display text-2xl font-bold text-success">{totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
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
              <p className="font-display text-2xl font-bold" dir="ltr">{profitMargin}%</p>
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
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              {truckProfits.map((truck, index) => {
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
                    <td className="px-4 py-3 font-bold text-success">
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
