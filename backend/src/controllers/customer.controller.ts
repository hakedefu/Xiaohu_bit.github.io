import { Response } from 'express';
import type { CustomerLevel, CustomerStatus } from '@prisma/client';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth';
import customerService from '../services/customer.service';
import { ApiResponse } from '../types';

/**
 * 创建客户
 */
export const createCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, phone, company, level, tags, notes } = req.body;

  const customer = await customerService.createCustomer(
    { name, email, phone, company, level, tags, notes },
    req.user!.userId
  );

  const response: ApiResponse<any> = {
    success: true,
    data: customer,
    message: '客户已创建',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * 获取客户详情
 */
export const getCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const customer = await customerService.getCustomer(id);

  const response: ApiResponse<any> = {
    success: true,
    data: customer,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新客户
 */
export const updateCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, company, level, status, tags, notes } = req.body;

  const customer = await customerService.updateCustomer(id, {
    name,
    email,
    phone,
    company,
    level,
    status,
    tags,
    notes,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: customer,
    message: '客户已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 删除客户
 */
export const deleteCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await customerService.deleteCustomer(id);

  const response: ApiResponse<null> = {
    success: true,
    message: '客户已删除',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 搜索客户
 */
export const searchCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { keyword, level, status, tags, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

  const normalizedTags =
    typeof tags === 'string'
      ? [tags]
      : Array.isArray(tags)
        ? tags.filter((tag): tag is string => typeof tag === 'string')
        : undefined;

  const filters = {
    keyword: keyword as string | undefined,
    level: (typeof level === 'string' ? level : undefined) as CustomerLevel | undefined,
    status: (typeof status === 'string' ? status : undefined) as CustomerStatus | undefined,
    tags: normalizedTags,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
  };

  const result = await customerService.searchCustomers(filters, {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  });

  const response: ApiResponse<any> = {
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取客户列表
 */
export const getCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await customerService.getCustomers({
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  });

  const response: ApiResponse<any> = {
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取客户统计
 */
export const getCustomerStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await customerService.getCustomerStats();

  const response: ApiResponse<any> = {
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});
