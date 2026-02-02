import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // 服务器
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:4000',

  // 数据库
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/customer_crm',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // 文件存储
  fileStorageType: process.env.FILE_STORAGE_TYPE || 'local',
  fileUploadDir: process.env.FILE_UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),

  // 日志
  logLevel: process.env.LOG_LEVEL || 'info',

  // 特性开关
  enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
};

export default config;
