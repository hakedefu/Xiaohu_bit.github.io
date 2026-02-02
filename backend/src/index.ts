import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 环境: ${config.nodeEnv}`);
  console.log(`💾 数据库: ${config.databaseUrl.split('@')[1] || '已配置'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM 已接收，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 已接收，正在关闭服务器...');
  process.exit(0);
});
