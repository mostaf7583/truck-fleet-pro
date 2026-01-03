import { useState } from 'react';
import { Plus, Search, Filter, Calendar, MapPin, Truck, User, MoreVertical, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, driversApi, trucksApi } from '@/lib/api';
import { Trip, Driver, Truck as TruckType } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { TripFinancials } from '@/components/TripFinancials';

const statusStyles = {
  SCHEDULED: 'bg-primary/10 text-primary border-primary/20',
  IN_PROGRESS: 'bg-info/10 text-info border-info/20',
  COMPLETED: 'bg-success/10 text-success border-success/20',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels: Record<string, string> = {
  SCHEDULED: 'مجدولة',
  IN_PROGRESS: 'جارية',
  COMPLETED: 'مكتملة',
  CANCELLED: 'ملغاة',
};

export default function Trips() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trips = [], isLoading: isLoadingTrips } = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: driversApi.getAll,
  });

  const { data: trucks = [] } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tripsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'تم جدولة الرحلة',
        description: 'تم إضافة الرحلة الجديدة بنجاح.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trip> }) => tripsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsAddDialogOpen(false);
      setEditingTrip(null);
      toast({
        title: 'تم تحديث الرحلة',
        description: 'تم تحديث بيانات الرحلة بنجاح.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tripsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'تم حذف الرحلة',
        description: 'تم إزالة الرحلة من النظام.',
        variant: 'destructive',
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Trip['status'] | 'ALL'>('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [financialsTripId, setFinancialsTripId] = useState<string | null>(null);

  const getDriver = (id: string) => drivers.find((d: Driver) => d.id === id);
  const getTruck = (id: string) => trucks.find((t: TruckType) => t.id === id);

  const filteredTrips = trips.filter((trip: Trip) => {
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || trip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeTripsCount = trips.filter((t: Trip) => t.status === 'IN_PROGRESS').length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tripData = {
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
      driverId: formData.get('driverId') as string,
      truckId: formData.get('truckId') as string,
      clientName: formData.get('clientName') as string,
      distance: Number(formData.get('distance')),
      status: editingTrip ? (formData.get('status') as Trip['status']) : 'SCHEDULED', // Default to SCHEDULED for new trips
    };

    if (editingTrip) {
      updateMutation.mutate({ id: editingTrip.id, data: tripData });
    } else {
      createMutation.mutate(tripData);
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsAddDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) setEditingTrip(null);
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingTrips) return <div>تحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">الرحلات</h1>
          <p className="text-muted-foreground">إدارة وجدولة رحلات الأسطول</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              جدولة رحلة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTrip ? 'تعديل الرحلة' : 'جدولة رحلة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingTrip ? 'تحديث تفاصيل الرحلة.' : 'أدخل تفاصيل الرحلة الجديدة.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">نقطة الانطلاق</Label>
                  <Input id="origin" name="origin" defaultValue={editingTrip?.origin} placeholder="الرياض" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">الوجهة</Label>
                  <Input id="destination" name="destination" defaultValue={editingTrip?.destination} placeholder="جدة" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={editingTrip?.startDate ? format(new Date(editingTrip.startDate), 'yyyy-MM-dd') : ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ الوصول المتوقع</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={editingTrip?.endDate ? format(new Date(editingTrip.endDate), 'yyyy-MM-dd') : ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverId">السائق</Label>
                  <Select name="driverId" defaultValue={editingTrip?.driverId || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سائق" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.filter((d: Driver) => d.status === 'AVAILABLE' || d.id === editingTrip?.driverId).map((driver: Driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="truckId">الشاحنة</Label>
                  <Select name="truckId" defaultValue={editingTrip?.truckId || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر شاحنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.filter((t: TruckType) => t.status === 'ACTIVE' || t.id === editingTrip?.truckId).map((truck: TruckType) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plateNumber} ({truck.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">العميل</Label>
                <Input id="clientName" name="clientName" defaultValue={editingTrip?.clientName} placeholder="شركة أرامكو" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">المسافة (كم)</Label>
                <Input id="distance" name="distance" type="number" defaultValue={editingTrip?.distance} placeholder="950" required />
              </div>

              {editingTrip && (
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select name="status" defaultValue={editingTrip.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">مجدولة</SelectItem>
                      <SelectItem value="IN_PROGRESS">جارية</SelectItem>
                      <SelectItem value="COMPLETED">مكتملة</SelectItem>
                      <SelectItem value="CANCELLED">ملغاة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  {editingTrip ? 'حفظ التغييرات' : 'جدولة الرحلة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(status as Trip['status'] | 'ALL')}
            className="whitespace-nowrap"
          >
            {status === 'ALL' ? 'الكل' : statusLabels[status]}
          </Button>
        ))}
      </div>


      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip: Trip, index: number) => {
          const driver = getDriver(trip.driverId);
          const truck = getTruck(trip.truckId);

          return (
            <div
              key={trip.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleEditTrip(trip)}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Trip Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn("font-normal", statusStyles[trip.status])}>
                      {statusLabels[trip.status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {trip.distance} كم
                    </span>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs">من</span>
                      </div>
                      <p className="font-semibold">{trip.origin}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(trip.startDate), 'MMM d, h:mm a')}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="h-[2px] w-16 bg-border" />
                      <Truck className="h-4 w-4 text-muted-foreground/50" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs">إلى</span>
                      </div>
                      <p className="font-semibold">{trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.endDate ? format(new Date(trip.endDate), 'MMM d, h:mm a') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{driver?.firstName} {driver?.lastName}</p>
                      <p className="text-xs text-muted-foreground">سائق</p>
                    </div>
                  </div>

                  <div className="h-8 w-[1px] bg-border" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{truck?.plateNumber}</p>
                      <p className="text-xs text-muted-foreground">{truck?.model}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFinancialsTripId(trip.id);
                      }}
                      title="المالية"
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <TripFinancials
        tripId={financialsTripId}
        open={!!financialsTripId}
        onOpenChange={(open) => !open && setFinancialsTripId(null)}
      />
      {filteredTrips.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">لا يوجد رحلات</p>
          <p className="text-sm text-muted-foreground">حاول تغيير البحث أو الفلاتر</p>
        </div>
      )}
    </div>
  );
}
