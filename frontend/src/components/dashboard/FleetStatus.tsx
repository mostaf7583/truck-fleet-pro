import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Truck } from '@/types';

interface FleetStatusProps {
  trucks: Truck[];
}

export function FleetStatus({ trucks }: FleetStatusProps) {
  const statusCounts = {
    active: trucks.filter(t => t.status === 'ACTIVE').length,
    maintenance: trucks.filter(t => t.status === 'MAINTENANCE').length,
    inactive: trucks.filter(t => t.status === 'INACTIVE').length,
  };

  const data = [
    { name: 'نشط', value: statusCounts.active, color: 'hsl(142, 76%, 36%)' },
    { name: 'صيانة', value: statusCounts.maintenance, color: 'hsl(38, 92%, 50%)' },
    { name: 'غير نشط', value: statusCounts.inactive, color: 'hsl(215, 16%, 47%)' },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">حالة الأسطول</h3>
        <p className="text-sm text-muted-foreground">توفر الشاحنات الحالي</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
