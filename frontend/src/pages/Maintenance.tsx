import { useState } from 'react';
import { Plus, Search, Wrench, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MaintenanceRecord, Truck } from '@/types';
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
import { Textarea } from '@/components/ui/textarea'; // Added Import
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi, trucksApi } from '@/lib/api';

const typeStyles = {
  ROUTINE: 'bg-success/10 text-success border-success/20',
  REPAIR: 'bg-warning/10 text-warning border-warning/20',
  INSPECTION: 'bg-primary/10 text-primary border-primary/20',
  EMERGENCY: 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeLabels: Record<string, string> = {
  ROUTINE: 'دورية',
  REPAIR: 'إصلاح',
  INSPECTION: 'فحص',
  EMERGENCY: 'طارئة',
};

export default function Maintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: records = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ['maintenanceRecords'],
    queryFn: maintenanceApi.getAll,
  });

  const { data: trucks = [] } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'تم إضافة سجل الصيانة',
        description: 'تم إضافة سجل الصيانة بنجاح.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceRecord> }) => maintenanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      setIsAddDialogOpen(false);
      setEditingRecord(null);
      toast({
        title: 'تم تحديث سجل الصيانة',
        description: 'تم تحديث سجل الصيانة بنجاح.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: maintenanceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      toast({
        title: 'تم حذف سجل الصيانة',
        description: 'تم إزالة سجل الصيانة من النظام.',
        variant: 'destructive',
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  const getTruck = (id: string) => trucks.find((t: Truck) => t.id === id);

  const filteredRecords = records.filter((record: MaintenanceRecord) => {
    const truck = getTruck(record.truckId);
    return truck?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vendor.toLowerCase().includes(searchQuery.toLowerCase()); // Changed from serviceProvider to vendor
  });

  const totalMaintenanceCost = records.reduce((sum: number, r: MaintenanceRecord) => sum + r.cost, 0);
  const emergencyCount = records.filter((r: MaintenanceRecord) => r.type === 'EMERGENCY').length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const recordData = {
      truckId: formData.get('truckId') as string,
      type: formData.get('type') as MaintenanceRecord['type'],
      cost: Number(formData.get('cost')),
      date: new Date(formData.get('date') as string),
      description: formData.get('description') as string,
      vendor: formData.get('vendor') as string, // Changed from serviceProvider to vendor
    };

    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: recordData });
    } else {
      createMutation.mutate(recordData);
    }
  };

  const handleEditRecord = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setIsAddDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingRecords) return <div>تحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">سجلات الصيانة</h1> {/* Updated title */}
          <p className="text-muted-foreground">إدارة صيانة وإصلاحات الأسطول</p> {/* Updated description */}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة سجل صيانة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'تعديل سجل صيانة' : 'إضافة سجل صيانة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingRecord ? 'تحديث تفاصيل الصيانة.' : 'تسجيل عملية صيانة جديدة.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="truckId">الشاحنة</Label>
                <Select name="truckId" defaultValue={editingRecord?.truckId || ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر شاحنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.filter((t: Truck) => t.status !== 'INACTIVE' || t.id === editingRecord?.truckId).map((truck: Truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.plateNumber} - {truck.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الصيانة</Label> {/* Updated label */}
                  <Select name="type" defaultValue={editingRecord?.type || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROUTINE">دورية</SelectItem>
                      <SelectItem value="REPAIR">إصلاح</SelectItem>
                      <SelectItem value="INSPECTION">فحص</SelectItem>
                      <SelectItem value="EMERGENCY">طارئة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">التكلفة</Label>
                  <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editingRecord?.cost} placeholder="500.00" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={editingRecord?.date ? format(new Date(editingRecord.date), 'yyyy-MM-dd') : ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">مقدم الخدمة</Label> {/* Updated label and name */}
                  <Input id="vendor" name="vendor" defaultValue={editingRecord?.vendor} placeholder="ورشة..." required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea id="description" name="description" defaultValue={editingRecord?.description} placeholder="تفاصيل الصيانة..." required /> {/* Changed to Textarea */}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  {editingRecord ? 'حفظ التغييرات' : 'إضافة السجل'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي تكلفة الصيانة</p>
              <p className="font-display text-2xl font-bold">{totalMaintenanceCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي السجلات</p>
              <p className="font-display text-2xl font-bold">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إصلاحات طارئة</p>
              <p className="font-display text-2xl font-bold">{emergencyCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث في سجلات الصيانة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Records List */} {/* Changed from Records Grid to Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record: MaintenanceRecord, index: number) => {
          const truck = getTruck(record.truckId);

          return (
            <div
              key={record.id}
              className="group overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleEditRecord(record)} // Added onClick for editing
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg border", typeStyles[record.type])}>
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{truck?.plateNumber}</p>
                    <p className="text-sm text-muted-foreground">{truck?.model}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("capitalize", typeStyles[record.type])}>
                  {typeLabels[record.type] || record.type}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm">{record.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">التكلفة</span>
                  <span className="font-bold text-primary">{record.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">التاريخ</span>
                  <span className="font-medium">{format(record.date, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المورد</span>
                  <span className="font-medium">{record.vendor}</span>
                </div>
              </div>

              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
