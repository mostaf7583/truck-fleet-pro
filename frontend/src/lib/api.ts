import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8600/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const trucksApi = {
    getAll: (page = 0, size = 10) => api.get(`/trucks?page=${page}&size=${size}`).then(res => res.data),
    getById: (id: string) => api.get(`/trucks/${id}`).then(res => res.data),
    create: (data: any) => api.post('/trucks', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/trucks/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/trucks/${id}`).then(res => res.data),
};

export const driversApi = {
    getAll: (page = 0, size = 10) => api.get(`/drivers?page=${page}&size=${size}`).then(res => res.data),
    getById: (id: string) => api.get(`/drivers/${id}`).then(res => res.data),
    create: (data: any) => api.post('/drivers', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/drivers/${id}`, data).then(res => res.data),
    delete: (id: string) => api.delete(`/drivers/${id}`).then(res => res.data),
};

export const tripsApi = {
    getAll: (page = 0, size = 10) => api.get(`/trips?page=${page}&size=${size}`).then(res => res.data),
    getById: (id: string) => api.get(`/trips/${id}`).then(res => res.data),
    create: (data: any) => api.post('/trips', data).then(res => res.data),
    update: (id: string, data: any) => api.put(`/trips/${id}`, data).then(res => res.data),
    updateStatus: (id: string, status: string) => api.patch(`/trips/${id}/status?status=${status}`).then(res => res.data),
    delete: (id: string) => api.delete(`/trips/${id}`).then(res => res.data),
};

export const fuelApi = {
    getAll: (page = 0, size = 10) => api.get(`/fuel-records?page=${page}&size=${size}`).then((res) => res.data),
    create: (data: any) => api.post('/fuel-records', data).then((res) => res.data),
    update: (id: string, data: any) => api.put(`/fuel-records/${id}`, data).then((res) => res.data),
    delete: (id: string) => api.delete(`/fuel-records/${id}`).then((res) => res.data),
};

export const maintenanceApi = {
    getAll: (page = 0, size = 10) => api.get(`/maintenance-records?page=${page}&size=${size}`).then((res) => res.data),
    create: (data: any) => api.post('/maintenance-records', data).then((res) => res.data),
    update: (id: string, data: any) => api.put(`/maintenance-records/${id}`, data).then((res) => res.data),
    delete: (id: string) => api.delete(`/maintenance-records/${id}`).then((res) => res.data),
};

export const tripIncomeApi = {
    getAll: (page = 0, size = 10) => api.get(`/trip-incomes?page=${page}&size=${size}`).then((res) => res.data),
    getByTripId: (tripId: string) => api.get(`/trip-incomes/trip/${tripId}`).then((res) => res.data),
    create: (data: any) => api.post('/trip-incomes', data).then((res) => res.data),
    update: (id: string, data: any) => api.put(`/trip-incomes/${id}`, data).then((res) => res.data),
    delete: (id: string) => api.delete(`/trip-incomes/${id}`).then((res) => res.data),
};

export const tripExpenseApi = {
    getAll: (page = 0, size = 10) => api.get(`/trip-expenses?page=${page}&size=${size}`).then((res) => res.data),
    getByTripId: (tripId: string) => api.get(`/trip-expenses/trip/${tripId}`).then((res) => res.data),
    create: (data: any) => api.post('/trip-expenses', data).then((res) => res.data),
    update: (id: string, data: any) => api.put(`/trip-expenses/${id}`, data).then((res) => res.data),
    delete: (id: string) => api.delete(`/trip-expenses/${id}`).then((res) => res.data),
};

export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats').then(res => res.data),
};

export default api;
