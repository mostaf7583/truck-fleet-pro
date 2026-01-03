import { Trip, Driver, Truck } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentTripsTableProps {
  trips: Trip[];
  drivers: Driver[];
  trucks: Truck[];
}

const statusStyles = {
  SCHEDULED: 'bg-muted text-muted-foreground',
  IN_PROGRESS: 'bg-primary/10 text-primary border-primary/20',
  COMPLETED: 'bg-success/10 text-success border-success/20',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels: Record<string, string> = {
  SCHEDULED: 'مجدول',
  IN_PROGRESS: 'جاري',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

export function RecentTripsTable({ trips, drivers, trucks }: RecentTripsTableProps) {
  const getDriver = (id: string) => drivers.find(d => d.id === id);
  const getTruck = (id: string) => trucks.find(t => t.id === id);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b p-4">
        <h3 className="font-display text-lg font-semibold">الرحلات الأخيرة</h3>
        <p className="text-sm text-muted-foreground">آخر أنشطة النقل</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">المسار</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">السائق</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الشاحنة</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">التاريخ</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {trips.map((trip, index) => {
              const driver = getDriver(trip.driverId);
              const truck = getTruck(trip.truckId);

              return (
                <tr
                  key={trip.id}
                  className="transition-colors hover:bg-muted/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{trip.origin}</p>
                      <p className="text-sm text-muted-foreground">← {trip.destination}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{driver?.firstName} {driver?.lastName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{truck?.plateNumber}</p>
                      <p className="text-sm text-muted-foreground">{truck?.model}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(trip.startDate, 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusStyles[trip.status])}
                    >
                      {statusLabels[trip.status] || trip.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
