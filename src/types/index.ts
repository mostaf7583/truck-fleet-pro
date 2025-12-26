export type TruckStatus = 'active' | 'maintenance' | 'inactive';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'accountant' | 'dispatcher';

export interface Truck {
  id: string;
  plateNumber: string;
  model: string;
  status: TruckStatus;
  capacity: number;
  year: number;
  mileage: number;
  createdAt: Date;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: Date;
  phone: string;
  email: string;
  assignedTruckId?: string;
  status: 'available' | 'on_trip' | 'off_duty';
  createdAt: Date;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  startDate: Date;
  endDate?: Date;
  driverId: string;
  truckId: string;
  status: TripStatus;
  distance: number;
  clientName: string;
  createdAt: Date;
}

export interface FuelRecord {
  id: string;
  truckId: string;
  tripId?: string;
  amount: number;
  cost: number;
  date: Date;
  station: string;
  odometerReading: number;
}

export interface MaintenanceRecord {
  id: string;
  truckId: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  cost: number;
  date: Date;
  nextDueDate?: Date;
  vendor: string;
}

export interface TripExpense {
  id: string;
  tripId: string;
  type: 'fuel' | 'toll' | 'repair' | 'food' | 'lodging' | 'other';
  description: string;
  amount: number;
  date: Date;
}

export interface TripIncome {
  id: string;
  tripId: string;
  clientName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeTrips: number;
  activeTrucks: number;
  availableDrivers: number;
  pendingPayments: number;
}
