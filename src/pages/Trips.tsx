import { useState } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
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

const statusLabels: Record<string, string> = {
  scheduled: 'مجدول',
  in_progress: 'جاري',
  completed: 'مكتمل',
  cancelled: 'ملغي',
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
      title: 'تم إنشاء الرحلة',
      description: `تم جدولة رحلة من ${newTrip.origin} إلى ${newTrip.destination}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">الرحلات</h1>
          <p className="text-muted-foreground">إدارة جداول النقل</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              جدولة رحلة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>جدولة رحلة جديدة</DialogTitle>
              <DialogDescription>
                إنشاء جدول نقل جديد.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">نقطة الانطلاق</Label>
                  <Input id="origin" name="origin" placeholder="الرياض" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">الوجهة</Label>
                  <Input id="destination" name="destination" placeholder="جدة" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">المسافة (كم)</Label>
                  <Input id="distance" name="distance" type="number" placeholder="900" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverId">السائق</Label>
                  <Select name="driverId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سائق" />
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
                  <Label htmlFor="truckId">الشاحنة</Label>
                  <Select name="truckId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر شاحنة" />
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
                <Label htmlFor="clientName">اسم العميل</Label>
                <Input id="clientName" name="clientName" placeholder="شركة الناقل..." required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  جدولة الرحلة
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن رحلات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="scheduled">مجدول</SelectItem>
            <SelectItem value="in_progress">جاري</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
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
                      <p className="text-sm text-muted-foreground">{trip.distance.toLocaleString()} كم</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
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
                    <span className="text-muted-foreground">السائق: </span>
                    <span className="font-medium">{driver?.firstName} {driver?.lastName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">الشاحنة: </span>
                    <span className="font-medium">{truck?.plateNumber}</span>
                  </div>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[trip.status])}>
                    {statusLabels[trip.status] || trip.status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">لا يوجد رحلات</p>
          <p className="text-sm text-muted-foreground">حاول تغيير البحث أو الفلاتر</p>
        </div>
      )}
    </div>
  );
}
