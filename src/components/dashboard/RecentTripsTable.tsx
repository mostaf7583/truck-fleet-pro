import { Trip } from '@/types';
import { mockDrivers, mockTrucks } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentTripsTableProps {
  trips: Trip[];
}

const statusStyles = {
  scheduled: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentTripsTable({ trips }: RecentTripsTableProps) {
  const getDriver = (id: string) => mockDrivers.find(d => d.id === id);
  const getTruck = (id: string) => mockTrucks.find(t => t.id === id);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b p-4">
        <h3 className="font-display text-lg font-semibold">Recent Trips</h3>
        <p className="text-sm text-muted-foreground">Latest transportation activities</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Route</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Truck</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
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
                      <p className="text-sm text-muted-foreground">→ {trip.destination}</p>
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
                      {trip.status.replace('_', ' ')}
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
