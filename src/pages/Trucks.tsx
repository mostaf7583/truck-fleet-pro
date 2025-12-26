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

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      title: 'Truck Added',
      description: `${newTruck.plateNumber} has been added to the fleet.`,
    });
  };

  const handleDeleteTruck = (id: string) => {
    setTrucks(trucks.filter(t => t.id !== id));
    toast({
      title: 'Truck Removed',
      description: 'The truck has been removed from the fleet.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Trucks</h1>
          <p className="text-muted-foreground">Manage your fleet vehicles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Truck
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Truck</DialogTitle>
              <DialogDescription>
                Enter the details of the new truck to add to your fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTruck} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number</Label>
                  <Input id="plateNumber" name="plateNumber" placeholder="ABC-1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" placeholder="Volvo FH16" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" placeholder="2023" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (kg)</Label>
                  <Input id="capacity" name="capacity" type="number" placeholder="25000" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input id="mileage" name="mileage" type="number" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient">
                  Add Truck
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
            placeholder="Search trucks..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteTruck(truck.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={cn("capitalize", statusStyles[truck.status])}>
                  {truck.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Year</span>
                <span className="font-medium">{truck.year}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{(truck.capacity / 1000).toFixed(0)}T</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mileage</span>
                <span className="font-medium">{truck.mileage.toLocaleString()} km</span>
              </div>
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
          <p className="text-lg font-medium text-muted-foreground">No trucks found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
