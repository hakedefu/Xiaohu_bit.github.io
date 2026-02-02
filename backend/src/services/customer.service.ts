import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '../utils/errors';
import { PaginatedResponse, PaginationParams } from '../types';

const prisma = new PrismaClient();

export interface CustomerSearchFilter {
  keyword?: string;
  level?: string;
  status?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

export class CustomerService {
  /**
   * 创建客户
   */
  async createCustomer(
    data: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      level?: string;
      tags?: string[];
      notes?: string;
    },
    createdBy: string
  ) {
    return await prisma.customer.create({
      data: {
        ...data,
        createdBy,
      },
    });
  }

  /**
   * 获取客户详情
   */
  async getCustomer(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });

    if (!customer) {
      throw new AppError(ErrorCode.NOT_FOUND, 404, '客户不存在');
    }

    return customer;
  }

  /**
   * 更新客户
   */
  async updateCustomer(customerId: string, data: any) {
    const customer = await prisma.customer.update({
      where: { id: customerId },
      data,
    });

    return customer;
  }

  /**
   * 删除客户
   */
  async deleteCustomer(customerId: string) {
    await prisma.customer.delete({
      where: { id: customerId },
    });
  }

  /**
   * 搜索客户
   */
  async searchCustomers(
    filters: CustomerSearchFilter,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { keyword, level, status, tags, dateFrom, dateTo } = filters;
    const { page = 1, limit = 20 } = pagination;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword } },
        { company: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (level) where.level = level;
    if (status) where.status = status;

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          projects: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取客户列表
   */
  async getCustomers(pagination: PaginationParams) {
    const { page = 1, limit = 20 } = pagination;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          projects: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
            },
          },
        },
      }),
      prisma.customer.count(),
    ]);

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取客户统计
   */
  async getCustomerStats() {
    const [total, byLevel, byStatus] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.groupBy({
        by: ['level'],
        _count: true,
      }),
      prisma.customer.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      total,
      byLevel: byLevel.reduce((acc, item) => {
        acc[item.level] = item._count;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
    };
  }
}

export default new CustomerService();
