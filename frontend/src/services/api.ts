import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加认证令牌
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器 - 处理错误
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // 令牌过期，清除并重定向到登录
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();

/**
 * 认证 API
 */
export const authApi = {
  register: (email: string, username: string, password: string, fullName: string) =>
    apiClient.post('/auth/register', { email, username, password, fullName }),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

/**
 * 客户 API
 */
export const customerApi = {
  create: (data: any) =>
    apiClient.post('/customers', data),

  getById: (id: string) =>
    apiClient.get(`/customers/${id}`),

  list: (page = 1, limit = 20) =>
    apiClient.get('/customers', { params: { page, limit } }),

  search: (filters: any, page = 1, limit = 20) =>
    apiClient.get('/customers/search', { params: { ...filters, page, limit } }),

  update: (id: string, data: any) =>
    apiClient.put(`/customers/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/customers/${id}`),

  getStats: () =>
    apiClient.get('/customers/stats'),
};

/**
 * 项目 API
 */
export const projectApi = {
  create: (data: any) =>
    apiClient.post('/projects', data),

  getById: (id: string) =>
    apiClient.get(`/projects/${id}`),

  search: (filters: any, page = 1, limit = 20) =>
    apiClient.get('/projects/search', { params: { ...filters, page, limit } }),

  getQuadrants: (userId?: string) =>
    apiClient.get('/projects/quadrant', { params: { userId } }),

  update: (id: string, data: any) =>
    apiClient.put(`/projects/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/projects/${id}/status`, { status }),

  updateQuadrant: (id: string, quadrant: string) =>
    apiClient.patch(`/projects/${id}/quadrant`, { quadrant }),

  getStats: (userId?: string) =>
    apiClient.get('/projects/stats', { params: { userId } }),
};

/**
 * 工作日志 API
 */
export const workLogApi = {
  create: (data: any) =>
    apiClient.post('/work-logs', data),

  getById: (id: string) =>
    apiClient.get(`/work-logs/${id}`),

  getProjectLogs: (projectId: string, page = 1, limit = 20) =>
    apiClient.get(`/work-logs/project/${projectId}`, { params: { page, limit } }),

  getUserLogs: (userId: string, page = 1, limit = 20) =>
    apiClient.get(`/work-logs/user/${userId}`, { params: { page, limit } }),

  getDateRange: (dateFrom: string, dateTo: string, userId?: string) =>
    apiClient.get('/work-logs/date-range', { params: { dateFrom, dateTo, userId } }),

  update: (id: string, data: any) =>
    apiClient.put(`/work-logs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/work-logs/${id}`),

  getStats: (userId?: string) =>
    apiClient.get('/work-logs/stats', { params: { userId } }),
};

export default apiClient;
