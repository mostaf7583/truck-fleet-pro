import { useState } from 'react';
import { Plus, Search, Fuel, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FuelRecord, Truck } from '@/types';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelApi, trucksApi } from '@/lib/api';

export default function FuelRecords() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: records = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ['fuelRecords'],
    queryFn: fuelApi.getAll,
  });

  const { data: trucks = [] } = useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: fuelApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      setIsAddDialogOpen(false);
      setEditingRecord(null); // Added this line
      toast({
        title: 'تم إضافة سجل الوقود',
        description: 'تم إضافة سجل الوقود بنجاح.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelRecord> }) => fuelApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      setIsAddDialogOpen(false);
      setEditingRecord(null);
      toast({
        title: 'تم تحديث سجل الوقود',
        description: 'تم تحديث سجل الوقود بنجاح.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: fuelApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelRecords'] });
      toast({
        title: 'تم حذف سجل الوقود',
        description: 'تم إزالة سجل الوقود من النظام.',
        variant: 'destructive',
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);

  const getTruck = (id: string) => trucks.find((t: Truck) => t.id === id);

  const filteredRecords = records.filter((record: FuelRecord) => {
    const truck = getTruck(record.truckId);
    return truck?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.station.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalFuelCost = records.reduce((sum: number, r: FuelRecord) => sum + r.cost, 0);
  const totalFuelAmount = records.reduce((sum: number, r: FuelRecord) => sum + r.amount, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const recordData = {
      truckId: formData.get('truckId') as string,
      amount: Number(formData.get('amount')),
      cost: Number(formData.get('cost')),
      date: new Date(formData.get('date') as string),
      station: formData.get('station') as string,
      odometerReading: Number(formData.get('odometerReading')),
    };

    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: recordData });
    } else {
      createMutation.mutate(recordData);
    }
  };

  const handleEditRecord = (record: FuelRecord) => {
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
          <h1 className="font-display text-3xl font-bold tracking-tight">سجلات الوقود</h1>
          <p className="text-muted-foreground">تتبع استهلاك الوقود والتكاليف</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة سجل وقود
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'تعديل سجل وقود' : 'إضافة سجل وقود'}</DialogTitle>
              <DialogDescription>
                {editingRecord ? 'تحديث بيانات سجل الوقود.' : 'تسجيل عملية شراء وقود جديدة.'}
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
                    {trucks.filter((t: Truck) => t.status === 'ACTIVE' || t.id === editingRecord?.truckId).map((truck: Truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.plateNumber} - {truck.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">الكمية (لتر)</Label>
                  <Input id="amount" name="amount" type="number" defaultValue={editingRecord?.amount} placeholder="450" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">التكلفة</Label>
                  <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editingRecord?.cost} placeholder="1575.00" required />
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
                  <Label htmlFor="odometerReading">قراءة العداد</Label>
                  <Input id="odometerReading" name="odometerReading" type="number" defaultValue={editingRecord?.odometerReading} placeholder="45500" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">المحطة</Label>
                <Input id="station" name="station" defaultValue={editingRecord?.station} placeholder="محطة بترول..." required />
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
              <p className="text-sm text-muted-foreground">إجمالي تكلفة الوقود</p>
              <p className="font-display text-2xl font-bold">{totalFuelCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Fuel className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي كمية الوقود</p>
              <p className="font-display text-2xl font-bold text-left" dir="ltr">{totalFuelAmount.toLocaleString()} L</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط تكلفة اللتر</p>
              <p className="font-display text-2xl font-bold">{(totalFuelAmount > 0 ? totalFuelCost / totalFuelAmount : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث بالشاحنة أو المحطة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Records Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الشاحنة</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">التاريخ</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">المحطة</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">الكمية</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">التكلفة</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">العداد</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.map((record: FuelRecord, index: number) => {
                const truck = getTruck(record.truckId);

                return (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-muted/20 animate-slide-up group"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleEditRecord(record)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{truck?.plateNumber}</p>
                        <p className="text-sm text-muted-foreground">{truck?.model}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {format(record.date, 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record.station}
                    </td>
                    <td className="px-4 py-3 font-medium" dir="ltr">
                      {record.amount} L
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {record.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground" dir="ltr">
                      {record.odometerReading.toLocaleString()} km
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteRecord(record.id); }}>
                        حذف
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
