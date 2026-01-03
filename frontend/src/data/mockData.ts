import { Truck, Driver, Trip, FuelRecord, MaintenanceRecord, TripExpense, TripIncome } from '@/types';

export const mockTrucks: Truck[] = [
  { id: '1', plateNumber: 'ABC-1234', model: 'Volvo FH16', status: 'active', capacity: 25000, year: 2022, mileage: 45000, createdAt: new Date('2022-01-15') },
  { id: '2', plateNumber: 'DEF-5678', model: 'Scania R500', status: 'active', capacity: 28000, year: 2021, mileage: 78000, createdAt: new Date('2021-06-20') },
  { id: '3', plateNumber: 'GHI-9012', model: 'Mercedes Actros', status: 'maintenance', capacity: 24000, year: 2023, mileage: 12000, createdAt: new Date('2023-03-10') },
  { id: '4', plateNumber: 'JKL-3456', model: 'MAN TGX', status: 'active', capacity: 26000, year: 2022, mileage: 56000, createdAt: new Date('2022-08-05') },
  { id: '5', plateNumber: 'MNO-7890', model: 'DAF XF', status: 'inactive', capacity: 22000, year: 2020, mileage: 120000, createdAt: new Date('2020-02-28') },
];

export const mockDrivers: Driver[] = [
  { id: '1', firstName: 'John', lastName: 'Smith', licenseNumber: 'DL-123456', licenseExpiry: new Date('2025-06-15'), phone: '+1-555-0101', email: 'john.smith@company.com', assignedTruckId: '1', status: 'on_trip', createdAt: new Date('2020-01-10') },
  { id: '2', firstName: 'Maria', lastName: 'Garcia', licenseNumber: 'DL-234567', licenseExpiry: new Date('2026-03-20'), phone: '+1-555-0102', email: 'maria.garcia@company.com', assignedTruckId: '2', status: 'available', createdAt: new Date('2021-05-15') },
  { id: '3', firstName: 'David', lastName: 'Johnson', licenseNumber: 'DL-345678', licenseExpiry: new Date('2024-12-01'), phone: '+1-555-0103', email: 'david.johnson@company.com', assignedTruckId: '4', status: 'on_trip', createdAt: new Date('2019-08-22') },
  { id: '4', firstName: 'Sarah', lastName: 'Williams', licenseNumber: 'DL-456789', licenseExpiry: new Date('2025-09-10'), phone: '+1-555-0104', email: 'sarah.williams@company.com', status: 'available', createdAt: new Date('2022-02-14') },
  { id: '5', firstName: 'Michael', lastName: 'Brown', licenseNumber: 'DL-567890', licenseExpiry: new Date('2024-07-25'), phone: '+1-555-0105', email: 'michael.brown@company.com', status: 'off_duty', createdAt: new Date('2020-11-30') },
];

export const mockTrips: Trip[] = [
  { id: '1', origin: 'New York, NY', destination: 'Los Angeles, CA', startDate: new Date('2024-01-15'), endDate: new Date('2024-01-19'), driverId: '1', truckId: '1', status: 'completed', distance: 2800, clientName: 'Global Logistics Inc.', createdAt: new Date('2024-01-10') },
  { id: '2', origin: 'Chicago, IL', destination: 'Houston, TX', startDate: new Date('2024-01-20'), driverId: '3', truckId: '4', status: 'in_progress', distance: 1090, clientName: 'Southern Distribution', createdAt: new Date('2024-01-18') },
  { id: '3', origin: 'Miami, FL', destination: 'Atlanta, GA', startDate: new Date('2024-01-25'), driverId: '2', truckId: '2', status: 'scheduled', distance: 660, clientName: 'East Coast Freight', createdAt: new Date('2024-01-20') },
  { id: '4', origin: 'Seattle, WA', destination: 'Denver, CO', startDate: new Date('2024-01-10'), endDate: new Date('2024-01-13'), driverId: '1', truckId: '1', status: 'completed', distance: 1320, clientName: 'Mountain Supplies Co.', createdAt: new Date('2024-01-05') },
  { id: '5', origin: 'Boston, MA', destination: 'Philadelphia, PA', startDate: new Date('2024-01-22'), driverId: '4', truckId: '2', status: 'scheduled', distance: 300, clientName: 'Northeast Express', createdAt: new Date('2024-01-19') },
];

export const mockFuelRecords: FuelRecord[] = [
  { id: '1', truckId: '1', tripId: '1', amount: 450, cost: 1575, date: new Date('2024-01-16'), station: 'Shell Highway 66', odometerReading: 45500 },
  { id: '2', truckId: '1', tripId: '1', amount: 420, cost: 1470, date: new Date('2024-01-18'), station: 'BP Interstate', odometerReading: 47200 },
  { id: '3', truckId: '4', tripId: '2', amount: 380, cost: 1330, date: new Date('2024-01-21'), station: 'Exxon Mobil', odometerReading: 56800 },
  { id: '4', truckId: '2', amount: 400, cost: 1400, date: new Date('2024-01-15'), station: 'Chevron', odometerReading: 78500 },
  { id: '5', truckId: '1', tripId: '4', amount: 350, cost: 1225, date: new Date('2024-01-11'), station: 'Texaco', odometerReading: 44200 },
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  { id: '1', truckId: '3', type: 'repair', description: 'Engine overhaul and transmission repair', cost: 8500, date: new Date('2024-01-20'), vendor: 'Heavy Duty Mechanics Inc.' },
  { id: '2', truckId: '1', type: 'routine', description: 'Oil change and filter replacement', cost: 450, date: new Date('2024-01-05'), nextDueDate: new Date('2024-04-05'), vendor: 'Quick Lube Pro' },
  { id: '3', truckId: '2', type: 'inspection', description: 'Annual DOT inspection', cost: 350, date: new Date('2024-01-10'), nextDueDate: new Date('2025-01-10'), vendor: 'State Inspection Center' },
  { id: '4', truckId: '4', type: 'routine', description: 'Brake pad replacement', cost: 1200, date: new Date('2024-01-08'), vendor: 'Brake Masters' },
  { id: '5', truckId: '5', type: 'emergency', description: 'Roadside tire blowout repair', cost: 650, date: new Date('2024-01-02'), vendor: 'Emergency Road Service' },
];

export const mockTripExpenses: TripExpense[] = [
  { id: '1', tripId: '1', type: 'fuel', description: 'Fuel - Shell Highway 66', amount: 1575, date: new Date('2024-01-16') },
  { id: '2', tripId: '1', type: 'fuel', description: 'Fuel - BP Interstate', amount: 1470, date: new Date('2024-01-18') },
  { id: '3', tripId: '1', type: 'toll', description: 'Interstate tolls', amount: 285, date: new Date('2024-01-15') },
  { id: '4', tripId: '1', type: 'food', description: 'Driver meals', amount: 180, date: new Date('2024-01-17') },
  { id: '5', tripId: '2', type: 'fuel', description: 'Fuel - Exxon Mobil', amount: 1330, date: new Date('2024-01-21') },
  { id: '6', tripId: '4', type: 'toll', description: 'Highway tolls', amount: 145, date: new Date('2024-01-11') },
  { id: '7', tripId: '4', type: 'lodging', description: 'Motel stay', amount: 120, date: new Date('2024-01-12') },
];

export const mockTripIncomes: TripIncome[] = [
  { id: '1', tripId: '1', clientName: 'Global Logistics Inc.', amount: 8500, paymentStatus: 'paid', dueDate: new Date('2024-02-15'), paidDate: new Date('2024-02-10') },
  { id: '2', tripId: '2', clientName: 'Southern Distribution', amount: 4200, paymentStatus: 'pending', dueDate: new Date('2024-02-20') },
  { id: '3', tripId: '3', clientName: 'East Coast Freight', amount: 2800, paymentStatus: 'pending', dueDate: new Date('2024-02-25') },
  { id: '4', tripId: '4', clientName: 'Mountain Supplies Co.', amount: 5500, paymentStatus: 'paid', dueDate: new Date('2024-02-10'), paidDate: new Date('2024-02-08') },
  { id: '5', tripId: '5', clientName: 'Northeast Express', amount: 1500, paymentStatus: 'pending', dueDate: new Date('2024-02-22') },
];

export const calculateDashboardStats = () => {
  const totalRevenue = mockTripIncomes.reduce((sum, income) => sum + income.amount, 0);
  const fuelExpenses = mockFuelRecords.reduce((sum, record) => sum + record.cost, 0);
  const maintenanceExpenses = mockMaintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
  const tripExpenses = mockTripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = fuelExpenses + maintenanceExpenses + tripExpenses;
  
  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    activeTrips: mockTrips.filter(t => t.status === 'in_progress').length,
    activeTrucks: mockTrucks.filter(t => t.status === 'active').length,
    availableDrivers: mockDrivers.filter(d => d.status === 'available').length,
    pendingPayments: mockTripIncomes.filter(i => i.paymentStatus === 'pending').reduce((sum, i) => sum + i.amount, 0),
  };
};
