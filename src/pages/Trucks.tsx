import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockTrucks } from '@/data/mockData';
import { Truck } from '@/types';
import { cn } from '@/lib/utils';
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
  active: 'bg-success/10 text-success border-success/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground',
};

const statusLabels = {
  active: 'نشط',
  maintenance: 'صيانة',
  inactive: 'غير نشط',
};

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const { toast } = useToast();

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch =
      truck.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || truck.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTruck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTruck: Truck = {
      id: String(trucks.length + 1),
      plateNumber: formData.get('plateNumber') as string,
      model: formData.get('model') as string,
      status: formData.get('status') as Truck['status'],
      capacity: Number(formData.get('capacity')),
      year: Number(formData.get('year')),
      mileage: Number(formData.get('mileage')),
      createdAt: new Date(),
    };
    setTrucks([...trucks, newTruck]);
    setIsAddDialogOpen(false);
    toast({
      title: 'تم إضافة الشاحنة',
      description: `تم إضافة الشاحنة ${newTruck.plateNumber} إلى الأسطول بنجاح.`,
    });
  };

  const handleEditTruck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTruck) return;

    const formData = new FormData(e.currentTarget);
    const updatedTrucks = trucks.map(truck => {
      if (truck.id === selectedTruck.id) {
        return {
          ...truck,
          plateNumber: formData.get('plateNumber') as string,
          model: formData.get('model') as string,
          status: formData.get('status') as Truck['status'],
          capacity: Number(formData.get('capacity')),
          year: Number(formData.get('year')),
          mileage: Number(formData.get('mileage')),
        };
      }
      return truck;
    });

    setTrucks(updatedTrucks);
    setIsEditDialogOpen(false);
    setSelectedTruck(null);
    toast({
      title: 'تم تحديث الشاحنة',
      description: 'تم تحديث تفاصيل الشاحنة بنجاح.',
    });
  };

  const handleDeleteTruck = (id: string) => {
    setTrucks(trucks.filter(t => t.id !== id));
    toast({
      title: 'تم حذف الشاحنة',
      description: 'تم إزالة الشاحنة من الأسطول.',
      variant: 'destructive',
    });
  };

  const openViewDialog = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">الشاحنات</h1>
          <p className="text-muted-foreground">إدارة مركبات الأسطول الخاصة بك</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة شاحنة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إضافة شاحنة جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الشاحنة الجديدة لإضافتها إلى الأسطول.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTruck} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">رقم اللوحة</Label>
                  <Input id="plateNumber" name="plateNumber" placeholder="أ ب ج - ١٢٣٤" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">الموديل</Label>
                  <Input id="model" name="model" placeholder="Volvo FH16" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">السنة</Label>
                  <Input id="year" name="year" type="number" placeholder="2023" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">الحمولة (كجم)</Label>
                  <Input id="capacity" name="capacity" type="number" placeholder="25000" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mileage">المسافة المقطوعة (كم)</Label>
                  <Input id="mileage" name="mileage" type="number" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select name="status" defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="gradient">
                  إضافة شاحنة
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الشاحنة</DialogTitle>
            <DialogDescription>
              عرض تفاصيل ومعلومات هذه الشاحنة.
            </DialogDescription>
          </DialogHeader>
          {selectedTruck && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم اللوحة</Label>
                  <p className="font-medium">{selectedTruck.plateNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الموديل</Label>
                  <p className="font-medium">{selectedTruck.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">السنة</Label>
                  <p className="font-medium">{selectedTruck.year}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحمولة</Label>
                  <p className="font-medium">{(selectedTruck.capacity / 1000).toFixed(0)} طن</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">المسافة المقطوعة</Label>
                  <p className="font-medium">{selectedTruck.mileage.toLocaleString()} كم</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <Badge variant="outline" className={cn("capitalize mt-1", statusStyles[selectedTruck.status])}>
                    {statusLabels[selectedTruck.status] || selectedTruck.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الشاحنة</DialogTitle>
            <DialogDescription>
              تحديث تفاصيل هذه الشاحنة.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTruck} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plateNumber">رقم اللوحة</Label>
                <Input id="edit-plateNumber" name="plateNumber" defaultValue={selectedTruck?.plateNumber} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">الموديل</Label>
                <Input id="edit-model" name="model" defaultValue={selectedTruck?.model} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-year">السنة</Label>
                <Input id="edit-year" name="year" type="number" defaultValue={selectedTruck?.year} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">الحمولة (كجم)</Label>
                <Input id="edit-capacity" name="capacity" type="number" defaultValue={selectedTruck?.capacity} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mileage">المسافة المقطوعة (كم)</Label>
                <Input id="edit-mileage" name="mileage" type="number" defaultValue={selectedTruck?.mileage} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">الحالة</Label>
                <Select name="status" defaultValue={selectedTruck?.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="gradient">
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث عن شاحنة..."
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
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="maintenance">صيانة</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trucks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTrucks.map((truck, index) => (
          <div
            key={truck.id}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">{truck.plateNumber}</h3>
                <p className="text-sm text-muted-foreground">{truck.model}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openViewDialog(truck)} className="flex items-center gap-2 justify-end">
                    <span>عرض التفاصيل</span>
                    <Eye className="h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openEditDialog(truck)} className="flex items-center gap-2 justify-end">
                    <span>تعديل</span>
                    <Edit className="h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive flex items-center gap-2 justify-end"
                    onClick={() => handleDeleteTruck(truck.id)}
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
                <Badge variant="outline" className={cn("capitalize", statusStyles[truck.status])}>
                  {statusLabels[truck.status] || truck.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">السنة</span>
                <span className="font-medium">{truck.year}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">الحمولة</span>
                <span className="font-medium">{(truck.capacity / 1000).toFixed(0)} طن</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">المسافة</span>
                <span className="font-medium">{truck.mileage.toLocaleString()} كم</span>
              </div>
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">لم يتم العثور على شاحنات</p>
          <p className="text-sm text-muted-foreground">حاول تغيير البحث أو الفلاتر</p>
        </div>
      )}
    </div>
  );
}
