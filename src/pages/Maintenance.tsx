import { useState } from 'react';
import { Plus, Search, Wrench, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockMaintenanceRecords, mockTrucks } from '@/data/mockData';
import { MaintenanceRecord } from '@/types';
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

const typeStyles = {
  routine: 'bg-success/10 text-success border-success/20',
  repair: 'bg-warning/10 text-warning border-warning/20',
  inspection: 'bg-primary/10 text-primary border-primary/20',
  emergency: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Maintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getTruck = (id: string) => mockTrucks.find(t => t.id === id);

  const filteredRecords = records.filter(record => {
    const truck = getTruck(record.truckId);
    return truck?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vendor.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalMaintenanceCost = records.reduce((sum, r) => sum + r.cost, 0);
  const emergencyCount = records.filter(r => r.type === 'emergency').length;

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: MaintenanceRecord = {
      id: String(records.length + 1),
      truckId: formData.get('truckId') as string,
      type: formData.get('type') as MaintenanceRecord['type'],
      description: formData.get('description') as string,
      cost: Number(formData.get('cost')),
      date: new Date(formData.get('date') as string),
      vendor: formData.get('vendor') as string,
    };
    setRecords([...records, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Maintenance Record Added',
      description: `Maintenance record for ${getTruck(newRecord.truckId)?.plateNumber} has been added.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">Track vehicle maintenance and repairs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
              <DialogDescription>
                Record a new maintenance or repair activity.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truckId">Truck</Label>
                  <Select name="truckId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTrucks.map(truck => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plateNumber} - {truck.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Oil change and filter replacement" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input id="cost" name="cost" type="number" step="0.01" placeholder="450.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" name="vendor" placeholder="Quick Lube Pro" required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient">
                  Add Record
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
              <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
              <p className="font-display text-2xl font-bold">${totalMaintenanceCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
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
              <p className="text-sm text-muted-foreground">Emergency Repairs</p>
              <p className="font-display text-2xl font-bold">{emergencyCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search maintenance records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record, index) => {
          const truck = getTruck(record.truckId);
          
          return (
            <div
              key={record.id}
              className="group overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{truck?.plateNumber}</p>
                    <p className="text-sm text-muted-foreground">{truck?.model}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("capitalize", typeStyles[record.type])}>
                  {record.type}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm">{record.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-bold text-primary">${record.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{format(record.date, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vendor</span>
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
