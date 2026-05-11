import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Local Monolith Backend

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const OrderService = {
  getOrders: () => api.get('/orders'),
  createOrder: (order) => api.post('/orders', order),
  updateOrder: (id, order) => api.put(`/orders/${id}`, order),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export const DispatchService = {
  getDispatchByOrder: (orderId) => api.get(`/dispatch/order/${orderId}`),
};

export const NotificationService = {
  getNotifications: () => api.get('/notifications'),
};

export const TrackingService = {
  getHistory: (orderId) => api.get(`/tracking/order/${orderId}`),
};

export const GpsService = {
  getRealisticRoute: (params) => api.get('/gps/route', { params }),
};
