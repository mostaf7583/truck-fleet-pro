import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 22500, expenses: 14200 },
  { month: 'Feb', revenue: 28000, expenses: 16800 },
  { month: 'Mar', revenue: 25500, expenses: 15400 },
  { month: 'Apr', revenue: 32000, expenses: 18900 },
  { month: 'May', revenue: 29500, expenses: 17200 },
  { month: 'Jun', revenue: 35000, expenses: 19500 },
];

export function ProfitChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold">Revenue vs Expenses</h3>
        <p className="text-sm text-muted-foreground">Monthly financial overview</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(199, 89%, 48%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(0, 84%, 60%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>
    </div>
  );
}
