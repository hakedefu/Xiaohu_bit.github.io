import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // 请求拦截器 - 添加认证令牌
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        // 响应拦截器 - 处理错误
        this.client.interceptors.response.use(response => response, error => {
            if (error.response?.status === 401) {
                // 令牌过期，清除并重定向到登录
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    get(url, config) {
        return this.client.get(url, config);
    }
    post(url, data, config) {
        return this.client.post(url, data, config);
    }
    put(url, data, config) {
        return this.client.put(url, data, config);
    }
    patch(url, data, config) {
        return this.client.patch(url, data, config);
    }
    delete(url, config) {
        return this.client.delete(url, config);
    }
}
export const apiClient = new ApiClient();
/**
 * 认证 API
 */
export const authApi = {
    register: (email, username, password, fullName) => apiClient.post('/auth/register', { email, username, password, fullName }),
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    getCurrentUser: () => apiClient.get('/auth/me'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    changePassword: (oldPassword, newPassword) => apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};
/**
 * 客户 API
 */
export const customerApi = {
    create: (data) => apiClient.post('/customers', data),
    getById: (id) => apiClient.get(`/customers/${id}`),
    list: (page = 1, limit = 20) => apiClient.get('/customers', { params: { page, limit } }),
    search: (filters, page = 1, limit = 20) => apiClient.get('/customers/search', { params: { ...filters, page, limit } }),
    update: (id, data) => apiClient.put(`/customers/${id}`, data),
    delete: (id) => apiClient.delete(`/customers/${id}`),
    getStats: () => apiClient.get('/customers/stats'),
};
/**
 * 项目 API
 */
export const projectApi = {
    create: (data) => apiClient.post('/projects', data),
    getById: (id) => apiClient.get(`/projects/${id}`),
    search: (filters, page = 1, limit = 20) => apiClient.get('/projects/search', { params: { ...filters, page, limit } }),
    getQuadrants: (userId) => apiClient.get('/projects/quadrant', { params: { userId } }),
    update: (id, data) => apiClient.put(`/projects/${id}`, data),
    updateStatus: (id, status) => apiClient.patch(`/projects/${id}/status`, { status }),
    updateQuadrant: (id, quadrant) => apiClient.patch(`/projects/${id}/quadrant`, { quadrant }),
    getStats: (userId) => apiClient.get('/projects/stats', { params: { userId } }),
};
/**
 * 工作日志 API
 */
export const workLogApi = {
    create: (data) => apiClient.post('/work-logs', data),
    getById: (id) => apiClient.get(`/work-logs/${id}`),
    getProjectLogs: (projectId, page = 1, limit = 20) => apiClient.get(`/work-logs/project/${projectId}`, { params: { page, limit } }),
    getUserLogs: (userId, page = 1, limit = 20) => apiClient.get(`/work-logs/user/${userId}`, { params: { page, limit } }),
    getDateRange: (dateFrom, dateTo, userId) => apiClient.get('/work-logs/date-range', { params: { dateFrom, dateTo, userId } }),
    update: (id, data) => apiClient.put(`/work-logs/${id}`, data),
    delete: (id) => apiClient.delete(`/work-logs/${id}`),
    getStats: (userId) => apiClient.get('/work-logs/stats', { params: { userId } }),
};
export default apiClient;
