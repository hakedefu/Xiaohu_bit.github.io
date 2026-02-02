import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../utils/errors';
import { PaginatedResponse, PaginationParams } from '../types';

const prisma = new PrismaClient();

export class WorkLogService {
  /**
   * 创建工作日志
   */
  async createWorkLog(data: {
    projectId: string;
    userId: string;
    title: string;
    description?: string;
    workType: string;
    duration: number;
    spentDate: Date;
    tags?: string[];
  }) {
    return await prisma.workLog.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            customerId: true,
          },
        },
      },
    });
  }

  /**
   * 获取项目的工作日志
   */
  async getProjectWorkLogs(
    projectId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20 } = pagination;

    const [logs, total] = await Promise.all([
      prisma.workLog.findMany({
        where: { projectId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { spentDate: 'desc' },
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
      }),
      prisma.workLog.count({ where: { projectId } }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取用户的工作日志
   */
  async getUserWorkLogs(
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20 } = pagination;

    const [logs, total] = await Promise.all([
      prisma.workLog.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { spentDate: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              customer: { select: { id: true, name: true } },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.workLog.count({ where: { userId } }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取工作日志详情
   */
  async getWorkLog(logId: string) {
    const log = await prisma.workLog.findUnique({
      where: { id: logId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        project: true,
      },
    });

    if (!log) {
      throw new AppError(ErrorCode.NOT_FOUND, 404, '工作日志不存在');
    }

    return log;
  }

  /**
   * 更新工作日志
   */
  async updateWorkLog(logId: string, data: any) {
    const log = await prisma.workLog.update({
      where: { id: logId },
      data,
      include: {
        user: true,
        project: true,
      },
    });

    return log;
  }

  /**
   * 删除工作日志
   */
  async deleteWorkLog(logId: string) {
    await prisma.workLog.delete({
      where: { id: logId },
    });
  }

  /**
   * 获取统计数据
   */
  async getWorkLogStats(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;

    const [totalLogs, totalHours, byType] = await Promise.all([
      prisma.workLog.count({ where }),
      prisma.workLog.aggregate({
        where,
        _sum: { duration: true },
      }),
      prisma.workLog.groupBy({
        by: ['workType'],
        where,
        _sum: { duration: true },
        _count: true,
      }),
    ]);

    const totalMinutes = totalHours._sum.duration || 0;
    const totalHoursCount = Math.round(totalMinutes / 60 * 10) / 10;

    return {
      totalLogs,
      totalHours: totalHoursCount,
      totalMinutes,
      byType: byType.map(item => ({
        type: item.workType,
        count: item._count,
        hours: Math.round((item._sum.duration || 0) / 60 * 10) / 10,
      })),
    };
  }

  /**
   * 获取日期范围内的工作日志
   */
  async getWorkLogsInDateRange(
    dateFrom: Date,
    dateTo: Date,
    userId?: string
  ) {
    const where: any = {
      spentDate: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (userId) where.userId = userId;

    return await prisma.workLog.findMany({
      where,
      orderBy: { spentDate: 'desc' },
      include: {
        user: { select: { id: true, username: true, fullName: true } },
        project: { select: { id: true, title: true } },
      },
    });
  }
}

export default new WorkLogService();
