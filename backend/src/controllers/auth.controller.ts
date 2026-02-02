import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../middleware/auth';
import authService from '../services/auth.service';
import { ApiResponse } from '../types';

/**
 * 用户注册
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, fullName } = req.body;

  const user = await authService.register(email, username, password, fullName);

  const response: ApiResponse<any> = {
    success: true,
    data: user,
    message: '注册成功',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * 用户登录
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  const response: ApiResponse<any> = {
    success: true,
    data: result,
    message: '登录成功',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 获取当前用户信息
 */
export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getUser(req.user!.userId);

  const response: ApiResponse<any> = {
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 更新用户信息
 */
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, avatar, phone, department } = req.body;

  const user = await authService.updateUser(req.user!.userId, {
    fullName,
    avatar,
    phone,
    department,
  });

  const response: ApiResponse<any> = {
    success: true,
    data: user,
    message: '用户信息已更新',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

/**
 * 修改密码
 */
export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  await authService.changePassword(req.user!.userId, oldPassword, newPassword);

  const response: ApiResponse<null> = {
    success: true,
    message: '密码已更改',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});
