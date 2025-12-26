import { useState } from 'react';
import { Plus, Search, Fuel, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockFuelRecords, mockTrucks } from '@/data/mockData';
import { FuelRecord } from '@/types';
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

export default function FuelRecords() {
  const [records, setRecords] = useState<FuelRecord[]>(mockFuelRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getTruck = (id: string) => mockTrucks.find(t => t.id === id);

  const filteredRecords = records.filter(record => {
    const truck = getTruck(record.truckId);
    return truck?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.station.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalFuelCost = records.reduce((sum, r) => sum + r.cost, 0);
  const totalFuelAmount = records.reduce((sum, r) => sum + r.amount, 0);

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: FuelRecord = {
      id: String(records.length + 1),
      truckId: formData.get('truckId') as string,
      amount: Number(formData.get('amount')),
      cost: Number(formData.get('cost')),
      date: new Date(formData.get('date') as string),
      station: formData.get('station') as string,
      odometerReading: Number(formData.get('odometerReading')),
    };
    setRecords([...records, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: 'Fuel Record Added',
      description: `Fuel record for ${getTruck(newRecord.truckId)?.plateNumber} has been added.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Fuel Records</h1>
          <p className="text-muted-foreground">Track fuel consumption and costs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Fuel Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Fuel Record</DialogTitle>
              <DialogDescription>
                Record a new fuel purchase.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (L)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="450" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input id="cost" name="cost" type="number" step="0.01" placeholder="1575.00" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometerReading">Odometer Reading</Label>
                  <Input id="odometerReading" name="odometerReading" type="number" placeholder="45500" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Input id="station" name="station" placeholder="Shell Highway 66" required />
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
              <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
              <p className="font-display text-2xl font-bold">${totalFuelCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Fuel className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fuel Volume</p>
              <p className="font-display text-2xl font-bold">{totalFuelAmount.toLocaleString()} L</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Cost/Liter</p>
              <p className="font-display text-2xl font-bold">${(totalFuelCost / totalFuelAmount).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by truck or station..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Truck</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Station</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Odometer</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.map((record, index) => {
                const truck = getTruck(record.truckId);
                
                return (
                  <tr 
                    key={record.id}
                    className="transition-colors hover:bg-muted/20 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
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
                    <td className="px-4 py-3 font-medium">
                      {record.amount} L
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      ${record.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.odometerReading.toLocaleString()} km
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
