import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockDrivers, mockTrucks } from '@/data/mockData';
import { Driver } from '@/types';
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
  available: 'bg-success/10 text-success border-success/20',
  on_trip: 'bg-primary/10 text-primary border-primary/20',
  off_duty: 'bg-muted text-muted-foreground',
};

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getTruck = (id?: string) => mockTrucks.find(t => t.id === id);

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDriver: Driver = {
      id: String(drivers.length + 1),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseExpiry: new Date(formData.get('licenseExpiry') as string),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: 'available',
      createdAt: new Date(),
    };
    setDrivers([...drivers, newDriver]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Driver Added',
      description: `${newDriver.firstName} ${newDriver.lastName} has been added.`,
    });
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(d => d.id !== id));
    toast({
      title: 'Driver Removed',
      description: 'The driver has been removed from the system.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground">Manage your driver workforce</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>
                Enter the driver's information to add them to your team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input id="licenseNumber" name="licenseNumber" placeholder="DL-123456" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry</Label>
                  <Input id="licenseExpiry" name="licenseExpiry" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+1-555-0100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="driver@company.com" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient">
                  Add Driver
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search drivers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver, index) => {
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
                      onClick={() => handleDeleteDriver(driver.id)}
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
                  <Badge variant="outline" className={cn("capitalize", statusStyles[driver.status])}>
                    {driver.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Truck</span>
                  <span className="font-medium">{truck?.plateNumber || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">License Expiry</span>
                  <span className="font-medium">{format(driver.licenseExpiry, 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" />
                  Email
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
          <p className="text-lg font-medium text-muted-foreground">No drivers found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
