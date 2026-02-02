import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError, ErrorCode } from '../utils/errors';
import { JWTPayload, UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        401,
        '缺少认证令牌'
      );
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      401,
      '无效的认证令牌'
    );
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        401,
        '未认证'
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        403,
        '权限不足'
      );
    }

    next();
  };
};

export const createToken = (user: any, secret: string, expiresIn: string): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn });
};
