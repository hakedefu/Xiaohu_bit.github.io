import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../utils/errors';
import { PaginatedResponse, PaginationParams } from '../types';

const prisma = new PrismaClient();

export interface ProjectSearchFilter {
  keyword?: string;
  status?: string;
  priority?: string;
  quadrant?: string;
  assignedToId?: string;
  customerId?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export class ProjectService {
  /**
   * 创建项目
   */
  async createProject(data: {
    title: string;
    description?: string;
    customerId: string;
    assignedToId: string;
    priority?: string;
    quadrant?: string;
    dueDate: Date;
    estimatedHours?: number;
    tags?: string[];
  }) {
    return await prisma.project.create({
      data: {
        ...data,
        status: 'BACKLOG',
      },
      include: {
        customer: true,
        assignedTo: true,
        workLogs: true,
      },
    });
  }

  /**
   * 获取项目详情
   */
  async getProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        customer: true,
        assignedTo: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        workLogs: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new AppError(ErrorCode.NOT_FOUND, 404, '项目不存在');
    }

    return project;
  }

  /**
   * 更新项目
   */
  async updateProject(projectId: string, data: any) {
    const project = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        customer: true,
        assignedTo: true,
        workLogs: true,
      },
    });

    return project;
  }

  /**
   * 更新项目状态
   */
  async updateProjectStatus(projectId: string, status: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });
  }

  /**
   * 更新项目象限（四象限）
   */
  async updateProjectQuadrant(projectId: string, quadrant: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: { quadrant },
    });
  }

  /**
   * 搜索项目
   */
  async searchProjects(
    filters: ProjectSearchFilter,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { keyword, status, priority, quadrant, assignedToId, customerId, dueDateFrom, dueDateTo } = filters;
    const { page = 1, limit = 20 } = pagination;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (quadrant) where.quadrant = quadrant;
    if (assignedToId) where.assignedToId = assignedToId;
    if (customerId) where.customerId = customerId;

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) where.dueDate.gte = dueDateFrom;
      if (dueDateTo) where.dueDate.lte = dueDateTo;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dueDate: 'asc' },
        include: {
          customer: {
            select: { id: true, name: true, level: true },
          },
          assignedTo: {
            select: { id: true, username: true, fullName: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取四象限数据
   */
  async getQuadrantProjects(userId?: string) {
    const where: any = {};
    if (userId) where.assignedToId = userId;

    const projects = await prisma.project.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, username: true } },
      },
    });

    const quadrants = {
      IMPORTANT_URGENT: projects.filter(p => p.quadrant === 'IMPORTANT_URGENT'),
      IMPORTANT_NOT_URGENT: projects.filter(p => p.quadrant === 'IMPORTANT_NOT_URGENT'),
      NOT_IMPORTANT_URGENT: projects.filter(p => p.quadrant === 'NOT_IMPORTANT_URGENT'),
      NOT_IMPORTANT_NOT_URGENT: projects.filter(p => p.quadrant === 'NOT_IMPORTANT_NOT_URGENT'),
    };

    return quadrants;
  }

  /**
   * 获取项目统计
   */
  async getProjectStats(userId?: string) {
    const where: any = {};
    if (userId) where.assignedToId = userId;

    const [total, byStatus, byPriority, overdue, dueSoon] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.project.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
      prisma.project.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.project.count({
        where: {
          ...where,
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {}),
      overdue,
      dueSoon,
    };
  }
}

export default new ProjectService();
