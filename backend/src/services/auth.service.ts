import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { createToken } from '../middleware/auth';
import { AppError, ErrorCode } from '../utils/errors';
import { IUser, UserRole } from '../types';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * 用户注册
   */
  async register(
    email: string,
    username: string,
    password: string,
    fullName: string
  ): Promise<IUser> {
    // 检查邮箱和用户名是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError(
        ErrorCode.CONFLICT,
        409,
        '邮箱或用户名已存在'
      );
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName,
        role: UserRole.STAFF,
      },
    });

    // 返回用户信息（不含密码）
    return this.formatUser(user);
  }

  /**
   * 用户登录
   */
  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        '邮箱或密码错误'
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        '邮箱或密码错误'
      );
    }

    // 检查用户是否激活
    if (!user.isActive) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        403,
        '用户账户已禁用'
      );
    }

    // 生成令牌
    const token = createToken(
      user,
      config.jwtSecret,
      config.jwtExpiration as import('jsonwebtoken').SignOptions['expiresIn']
    );

    return {
      token,
      user: this.formatUser(user),
    };
  }

  /**
   * 获取用户信息
   */
  async getUser(userId: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return this.formatUser(user);
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        avatar: data.avatar,
        phone: data.phone,
        department: data.department,
      },
    });

    return this.formatUser(user);
  }

  /**
   * 修改密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 404, '用户不存在');
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        '旧密码错误'
      );
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * 格式化用户对象（移除敏感信息）
   */
  private formatUser(user: any): IUser {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default new AuthService();
