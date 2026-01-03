import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Driver, Truck } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi, trucksApi } from '@/lib/api';

const statusStyles = {
  AVAILABLE: 'bg-success/10 text-success border-success/20',
  ON_TRIP: 'bg-primary/10 text-primary border-primary/20',
  OFF_DUTY: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'متاح',
  ON_TRIP: 'في رحلة',
  OFF_DUTY: 'خارج الخدمة',
};

export default function Drivers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: drivers = [], isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: driversApi.getAll,
  });

  const { data: trucks = [] } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  /* ... inside Drivers component ... */
  const createMutation = useMutation({
    mutationFn: driversApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'تم إضافة السائق',
        description: 'تم إضافة السائق بنجاح.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Driver> }) => driversApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsAddDialogOpen(false);
      setEditingDriver(null);
      toast({
        title: 'تم تحديث السائق',
        description: 'تم تحديث بيانات السائق بنجاح.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: driversApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast({
        title: 'تم حذف السائق',
        description: 'تم إزالة السائق من النظام.',
        variant: 'destructive',
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getTruck = (id?: string) => trucks.find((t: Truck) => t.id === id);

  const filteredDrivers = drivers.filter((driver: Driver) => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driverData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseExpiry: new Date(formData.get('licenseExpiry') as string),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as Driver['status'] || 'AVAILABLE',
      assignedTruckId: formData.get('assignedTruckId') as string || undefined,
    };

    if (editingDriver) {
      updateMutation.mutate({ id: editingDriver.id, data: driverData });
    } else {
      createMutation.mutate(driverData);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsAddDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) setEditingDriver(null);
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

  if (isLoadingDrivers) return <div>تحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">السائقين</h1>
          <p className="text-muted-foreground">إدارة فرق السائقين</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة سائق
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}</DialogTitle>
              <DialogDescription>
                {editingDriver ? 'تحديث معلومات السائق الحالي.' : 'أدخل معلومات السائق للإضافة إلى الفريق.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input id="firstName" name="firstName" defaultValue={editingDriver?.firstName} placeholder="محمد" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input id="lastName" name="lastName" defaultValue={editingDriver?.lastName} placeholder="أحمد" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">رقم الرخصة</Label>
                  <Input id="licenseNumber" name="licenseNumber" defaultValue={editingDriver?.licenseNumber} placeholder="DL-123456" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">تاريخ انتهاء الرخصة</Label>
                  <Input
                    id="licenseExpiry"
                    name="licenseExpiry"
                    type="date"
                    defaultValue={editingDriver?.licenseExpiry ? format(new Date(editingDriver.licenseExpiry), 'yyyy-MM-dd') : ''}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input id="phone" name="phone" defaultValue={editingDriver?.phone} placeholder="+966-555-0100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingDriver?.email} placeholder="driver@company.com" required />
                </div>
              </div>
              {/* Optional: Add Status and Truck Assigment fields if needed in edit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  {editingDriver ? 'حفظ التغييرات' : 'إضافة سائق'}
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
          placeholder="بحث عن سائفين..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver: Driver, index: number) => {
          const truck = getTruck(driver.assignedTruckId);

          return (
            <div
              key={driver.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-primary-foreground">
                    {driver.firstName[0]}{driver.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{driver.licenseNumber}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2 justify-end">
                      <span>عرض التفاصيل</span>
                      <Eye className="h-4 w-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 justify-end"
                      onClick={() => handleEditDriver(driver)}
                    >
                      <span>تعديل</span>
                      <Edit className="h-4 w-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive flex items-center gap-2 justify-end focus:text-destructive"
                      onClick={() => handleDeleteClick(driver.id)}
                    >
                      <span>حذف</span>
                      <Trash2 className="h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الحالة</span>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[driver.status])}>
                    {statusLabels[driver.status] || driver.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الشاحنة المعينة</span>
                  <span className="font-medium">{truck?.plateNumber || 'غير معين'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">انتهاء الرخصة</span>
                  <span className="font-medium">{format(driver.licenseExpiry, 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
                  <Phone className="h-4 w-4" />
                  اتصال
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" />
                  بريد
                </Button>
              </div>

              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">لا يوجد سائقين</p>
          <p className="text-sm text-muted-foreground">جرب تغيير البحث</p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف بيانات السائق نهائياً من النظام.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
