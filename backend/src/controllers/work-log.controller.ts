import { Response } from 'express';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth';
import workLogService from '../services/work-log.service';
import { ApiResponse } from '../types';

/**
 * 创建工作日志
 */
export const createWorkLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { projectId, title, description, workType, duration, spentDate, tags } = req.body;

  const log = await workLogService.createWorkLog({
    projectId,
    userId: req.user!.userId,
    title,
    description,
    workType,
    duration,
    spentDate: new Date(spentDate),
    tags,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: log,
    message: '工作日志已创建',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * 获取项目的工作日志
 */
export const getProjectWorkLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const result = await workLogService.getProjectWorkLogs(projectId, {
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
 * 获取用户的工作日志
 */
export const getUserWorkLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const result = await workLogService.getUserWorkLogs(userId, {
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
 * 获取工作日志详情
 */
export const getWorkLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const log = await workLogService.getWorkLog(id);

  const response: ApiResponse<any> = {
    success: true,
    data: log,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新工作日志
 */
export const updateWorkLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, workType, duration, spentDate, tags } = req.body;

  const log = await workLogService.updateWorkLog(id, {
    title,
    description,
    workType,
    duration,
    spentDate: spentDate ? new Date(spentDate) : undefined,
    tags,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: log,
    message: '工作日志已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 删除工作日志
 */
export const deleteWorkLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await workLogService.deleteWorkLog(id);

  const response: ApiResponse<null> = {
    success: true,
    message: '工作日志已删除',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取工作日志统计
 */
export const getWorkLogStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.query;
  const stats = await workLogService.getWorkLogStats(userId as string | undefined);

  const response: ApiResponse<any> = {
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取日期范围内的工作日志
 */
export const getWorkLogsInDateRange = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { dateFrom, dateTo, userId } = req.query;

  const logs = await workLogService.getWorkLogsInDateRange(
    new Date(dateFrom as string),
    new Date(dateTo as string),
    userId as string | undefined
  );

  const response: ApiResponse<any> = {
    success: true,
    data: logs,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});
