import app from './app';
import { config } from './config';

const PORT = Number(process.env.PORT || config.port || 4000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`Env: ${config.nodeEnv}`);
  const dbInfo = config.databaseUrl.split('@')[1] || 'configured';
  console.log(`DB: ${dbInfo}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  process.exit(0);
});
