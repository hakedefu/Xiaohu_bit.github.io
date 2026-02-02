import { Response } from 'express';
import type { Priority, ProjectStatus, Quadrant } from '@prisma/client';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth';
import projectService from '../services/project.service';
import { ApiResponse } from '../types';

/**
 * 创建项目
 */
export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, customerId, assignedToId, priority, quadrant, dueDate, estimatedHours, tags } = req.body;

  const project = await projectService.createProject({
    title,
    description,
    customerId,
    assignedToId,
    priority: (typeof priority === 'string' ? priority : undefined) as Priority | undefined,
    quadrant: (typeof quadrant === 'string' ? quadrant : undefined) as Quadrant | undefined,
    dueDate: new Date(dueDate),
    estimatedHours,
    tags,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: project,
    message: '项目已创建',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * 获取项目详情
 */
export const getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const project = await projectService.getProject(id);

  const response: ApiResponse<any> = {
    success: true,
    data: project,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新项目
 */
export const updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, priority, quadrant, dueDate, estimatedHours, actualHours, tags } = req.body;

  const project = await projectService.updateProject(id, {
    title,
    description,
    priority: (typeof priority === 'string' ? priority : undefined) as Priority | undefined,
    quadrant: (typeof quadrant === 'string' ? quadrant : undefined) as Quadrant | undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    estimatedHours,
    actualHours,
    tags,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: project,
    message: '项目已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新项目状态
 */
export const updateProjectStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const project = await projectService.updateProjectStatus(
    id,
    status as ProjectStatus
  );

  const response: ApiResponse<any> = {
    success: true,
    data: project,
    message: '项目状态已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新项目象限
 */
export const updateProjectQuadrant = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { quadrant } = req.body;

  const project = await projectService.updateProjectQuadrant(
    id,
    quadrant as Quadrant
  );

  const response: ApiResponse<any> = {
    success: true,
    data: project,
    message: '项目象限已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 搜索项目
 */
export const searchProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { keyword, status, priority, quadrant, assignedToId, customerId, dueDateFrom, dueDateTo, page = 1, limit = 20 } = req.query;

  const filters = {
    keyword: keyword as string | undefined,
    status: (typeof status === 'string' ? status : undefined) as ProjectStatus | undefined,
    priority: (typeof priority === 'string' ? priority : undefined) as Priority | undefined,
    quadrant: (typeof quadrant === 'string' ? quadrant : undefined) as Quadrant | undefined,
    assignedToId: assignedToId as string | undefined,
    customerId: customerId as string | undefined,
    dueDateFrom: dueDateFrom ? new Date(dueDateFrom as string) : undefined,
    dueDateTo: dueDateTo ? new Date(dueDateTo as string) : undefined,
  };

  const result = await projectService.searchProjects(filters, {
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
 * 获取四象限数据
 */
export const getQuadrantProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.query;
  const quadrants = await projectService.getQuadrantProjects(userId as string | undefined);

  const response: ApiResponse<any> = {
    success: true,
    data: quadrants,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取项目统计
 */
export const getProjectStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.query;
  const stats = await projectService.getProjectStats(userId as string | undefined);

  const response: ApiResponse<any> = {
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});
