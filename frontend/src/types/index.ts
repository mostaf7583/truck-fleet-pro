export type TruckStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY';
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
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION' | 'EMERGENCY';
  description: string;
  cost: number;
  date: Date;
  nextDueDate?: Date;
  vendor: string;
}

export interface TripExpense {
  id: string;
  tripId: string;
  type: 'FUEL' | 'TOLL' | 'REPAIR' | 'FOOD' | 'LODGING' | 'OTHER';
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
