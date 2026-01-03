
import { useState } from 'react';
import { Plus, Search, MapPin, Calendar, Clock, Truck as TruckIcon, User, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trip, Driver, Truck, TripStatus } from '@/types/index';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, driversApi, trucksApi } from '@/lib/api';

const statusColors: Record<TripStatus, 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'> = {
  SCHEDULED: 'secondary',
  IN_PROGRESS: 'default',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
};

const statusLabels: Record<TripStatus, string> = {
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
      setEditingTrip(null);
      toast({
        title: 'تم إنشاء الرحلة',
        description: 'تم إضافة رحلة جديدة بنجاح.',
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getDriver = (id: string) => drivers.find((d: Driver) => d.id === id);
  const getTruck = (id: string) => trucks.find((t: Truck) => t.id === id);

  const filteredTrips = trips.filter((trip: Trip) =>
    trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tripData = {
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      clientName: formData.get('clientName') as string,
      driverId: formData.get('driverId') as string,
      truckId: formData.get('truckId') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
      status: formData.get('status') as TripStatus,
      distance: Number(formData.get('distance')),
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

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) setEditingTrip(null);
  };

  if (isLoadingTrips) return <div>تحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">الرحلات</h1>
          <p className="text-muted-foreground">إدارة وجدولة الرحلات</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              رحلة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTrip ? 'تعديل الرحلة' : 'رحلة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingTrip ? 'تحديث بيانات الرحلة الحالية.' : 'إدخال بيانات رحلة جديدة.'}
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
              <div className="space-y-2">
                <Label htmlFor="clientName">اسم العميل</Label>
                <Input id="clientName" name="clientName" defaultValue={editingTrip?.clientName} placeholder="شركة النقل السريع" required />
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
                      {trucks.filter((t: Truck) => t.status === 'ACTIVE' || t.id === editingTrip?.truckId).map((truck: Truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plateNumber} - {truck.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    defaultValue={editingTrip?.startDate ? format(new Date(editingTrip.startDate), "yyyy-MM-dd'T'HH:mm") : ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ الوصول المتوقع</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    defaultValue={editingTrip?.endDate ? format(new Date(editingTrip.endDate), "yyyy-MM-dd'T'HH:mm") : ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select name="status" defaultValue={editingTrip?.status || 'SCHEDULED'} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختار الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">المسافة (كم)</Label>
                  <Input id="distance" name="distance" type="number" defaultValue={editingTrip?.distance} placeholder="850" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  {editingTrip ? 'حفظ التغييرات' : 'إضافة الرحلة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث بالمدينة أو العميل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Trips Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip: Trip, index: number) => {
          const driver = getDriver(trip.driverId);
          const truck = getTruck(trip.truckId);

          return (
            <div
              key={trip.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[trip.status]}>
                    {statusLabels[trip.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(trip.startDate), 'MMM d')}</span>
                </div>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditTrip(trip)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(trip.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{trip.origin}</p>
                    <p className="text-xs text-muted-foreground">الانطلاق</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center px-4">
                  <div className="h-px w-full border-t border-dashed border-border" />
                </div>
                <div className="flex items-center gap-2 text-left">
                  <div className="text-right">
                    <p className="font-medium">{trip.destination}</p>
                    <p className="text-xs text-muted-foreground">الوصول</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{driver?.firstName} {driver?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TruckIcon className="h-4 w-4" />
                    <span>{truck?.plateNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الرحلة نهائياً من النظام.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
