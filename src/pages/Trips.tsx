import { useState } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockTrips, mockDrivers, mockTrucks } from '@/data/mockData';
import { Trip } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  scheduled: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getDriver = (id: string) => mockDrivers.find(d => d.id === id);
  const getTruck = (id: string) => mockTrucks.find(t => t.id === id);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTrip: Trip = {
      id: String(trips.length + 1),
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      startDate: new Date(formData.get('startDate') as string),
      driverId: formData.get('driverId') as string,
      truckId: formData.get('truckId') as string,
      status: 'scheduled',
      distance: Number(formData.get('distance')),
      clientName: formData.get('clientName') as string,
      createdAt: new Date(),
    };
    setTrips([...trips, newTrip]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Trip Created',
      description: `Trip from ${newTrip.origin} to ${newTrip.destination} has been scheduled.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Trips</h1>
          <p className="text-muted-foreground">Manage transportation schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Trip</DialogTitle>
              <DialogDescription>
                Create a new transportation schedule.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input id="origin" name="origin" placeholder="New York, NY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" name="destination" placeholder="Los Angeles, CA" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" name="distance" type="number" placeholder="2800" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverId">Driver</Label>
                  <Select name="driverId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.filter(d => d.status === 'available').map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="truckId">Truck</Label>
                  <Select name="truckId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTrucks.filter(t => t.status === 'active').map(truck => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plateNumber} - {truck.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" name="clientName" placeholder="Client Company Inc." required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient">
                  Schedule Trip
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip, index) => {
          const driver = getDriver(trip.driverId);
          const truck = getTruck(trip.truckId);
          
          return (
            <div
              key={trip.id}
              className="group overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Route Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-display text-lg font-bold">{trip.origin}</p>
                      <p className="text-sm text-muted-foreground">{trip.distance.toLocaleString()} km</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-display text-lg font-bold">{trip.destination}</p>
                      <p className="text-sm text-muted-foreground">{trip.clientName}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(trip.startDate, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Driver: </span>
                    <span className="font-medium">{driver?.firstName} {driver?.lastName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Truck: </span>
                    <span className="font-medium">{truck?.plateNumber}</span>
                  </div>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[trip.status])}>
                    {trip.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">No trips found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
