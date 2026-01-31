/**
 * API 响应类型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 用户类型
 */
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  department?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 客户类型
 */
export enum CustomerLevel {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum CustomerStatus {
  PROSPECT = 'PROSPECT',
  SUPPORTING = 'SUPPORTING',
  MAINTENANCE = 'MAINTENANCE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  level: CustomerLevel;
  status: CustomerStatus;
  tags: string[];
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

/**
 * 项目类型
 */
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ProjectStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
}

export enum Quadrant {
  IMPORTANT_URGENT = 'IMPORTANT_URGENT',
  IMPORTANT_NOT_URGENT = 'IMPORTANT_NOT_URGENT',
  NOT_IMPORTANT_URGENT = 'NOT_IMPORTANT_URGENT',
  NOT_IMPORTANT_NOT_URGENT = 'NOT_IMPORTANT_NOT_URGENT',
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  customer?: Customer;
  assignedToId: string;
  assignedTo?: User;
  priority: Priority;
  status: ProjectStatus;
  quadrant: Quadrant;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  workLogs?: WorkLog[];
  comments?: ProjectComment[];
}

export interface ProjectQuadrants {
  IMPORTANT_URGENT: Project[];
  IMPORTANT_NOT_URGENT: Project[];
  NOT_IMPORTANT_URGENT: Project[];
  NOT_IMPORTANT_NOT_URGENT: Project[];
}

/**
 * 工作日志类型
 */
export enum WorkType {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  MEETING = 'MEETING',
  SUPPORT = 'SUPPORT',
  DEBUGGING = 'DEBUGGING',
  REVIEW = 'REVIEW',
  OTHER = 'OTHER',
}

export interface WorkLog {
  id: string;
  projectId: string;
  project?: Project;
  userId: string;
  user?: User;
  title: string;
  description?: string;
  workType: WorkType;
  duration: number; // 分钟
  spentDate: string;
  tags: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogStats {
  totalLogs: number;
  totalHours: number;
  totalMinutes: number;
  byType: Array<{
    type: WorkType;
    count: number;
    hours: number;
  }>;
}

/**
 * 项目评论
 */
export interface ProjectComment {
  id: string;
  projectId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 搜索模板
 */
export interface SearchTemplate {
  id: string;
  userId: string;
  name: string;
  filters: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
