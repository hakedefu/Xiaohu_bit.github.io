import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './utils/errors';
import { ApiResponse } from './types';

// 路由
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import projectRoutes from './routes/project.routes';
import workLogRoutes from './routes/work-log.routes';

const app: Express = express();

/**
 * 中间件
 */
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * 健康检查
 */
app.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse<null> = {
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

/**
 * API 路由
 */
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/work-logs', workLogRoutes);

/**
 * 404 处理
 */
app.use((_req: Request, res: Response) => {
  const response: ApiResponse<null> = {
    success: false,
    error: '路由不存在',
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
});

/**
 * 全局错误处理
 */
app.use(errorHandler);

export default app;
