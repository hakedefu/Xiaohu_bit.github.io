# 部署指南

## 🚀 部署选项

本系统支持多种部署方式，从本地开发到企业级云部署。

---

## 1. 本地开发部署

### 系统要求
- Windows 10 / macOS / Linux
- Node.js 18+
- PostgreSQL 14+
- npm / yarn

### 快速启动脚本

**Windows PowerShell:**
```powershell
# 创建项目目录
mkdir customer-crm
cd customer-crm

# 克隆或下载项目

# 安装后端依赖
cd backend
npm install --legacy-peer-deps

# 配置数据库
# 编辑 .env 文件，设置 DATABASE_URL
Copy-Item .env.example .env

# 运行迁移
npx prisma migrate dev --name init

# 启动后端
npm run dev

# 新开 PowerShell 窗口
cd frontend
npm install

# 启动前端
npm run dev
```

---

## 2. Docker 本地部署

### 前置要求
- Docker Desktop 安装并运行
- Docker Compose

### 启动步骤

```bash
# 项目根目录
docker-compose up --build

# 首次运行需要迁移数据库
docker-compose exec backend npm run migrate:prod

# 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:4000
```

### 常用 Docker 命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend    # 后端日志
docker-compose logs -f postgres   # 数据库日志

# 进入容器
docker-compose exec backend sh

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 完全清理（删除数据）
docker-compose down -v
```

---

## 3. 云部署（AWS EC2 示例）

### 环境准备

```bash
# SSH 进入 EC2 实例
ssh -i key.pem ec2-user@your-instance-ip

# 更新系统
sudo yum update -y

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 安装 PostgreSQL
sudo yum install -y postgresql postgresql-server

# 安装 Git
sudo yum install -y git

# 安装 Docker（可选）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 部署应用

```bash
# 克隆项目
git clone <repository-url>
cd customer-crm

# 创建系统服务（后端）
sudo tee /etc/systemd/system/crm-backend.service > /dev/null <<EOF
[Unit]
Description=Customer CRM Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/customer-crm/backend
ExecStart=/usr/bin/node /home/ec2-user/customer-crm/backend/dist/index.js
Restart=always
Environment="NODE_ENV=production"
Environment="PORT=4000"
Environment="DATABASE_URL=postgresql://user:password@localhost/customer_crm"

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable crm-backend
sudo systemctl start crm-backend

# 构建前端
cd /home/ec2-user/customer-crm/frontend
npm run build

# 配置 Nginx
sudo tee /etc/nginx/conf.d/crm.conf > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ec2-user/customer-crm/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4000/api/;
    }
}
EOF

# 启动 Nginx
sudo systemctl restart nginx
```

### 配置 HTTPS（Let's Encrypt）

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动更新
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 4. Heroku 部署

### 步骤

```bash
# 安装 Heroku CLI
npm install -g heroku

# 登录
heroku login

# 创建应用
heroku create my-customer-crm

# 配置数据库
heroku addons:create heroku-postgresql:standard-0 --app my-customer-crm

# 设置环境变量
heroku config:set JWT_SECRET=your-secret-key --app my-customer-crm
heroku config:set NODE_ENV=production --app my-customer-crm

# 部署
git push heroku main

# 运行迁移
heroku run npm run migrate:prod --app my-customer-crm

# 查看日志
heroku logs --tail --app my-customer-crm
```

---

## 5. 宝塔面板部署（中国用户）

### 环境配置

1. 购买云服务器并安装宝塔面板
2. 进入面板后台

### 部署步骤

```bash
# 创建网站
宝塔 → 网站 → 添加站点
- 域名：your-domain.com
- 运行环境：Node.js 18

# 上传项目
# 使用 SFTP 或宝塔文件管理上传代码

# 安装依赖
cd /www/wwwroot/customer-crm/backend
npm install --legacy-peer-deps

# 数据库配置
# 宝塔 → 数据库 → 创建 PostgreSQL 数据库

# 配置环境变量
vi .env
# DATABASE_URL=postgresql://user:password@localhost/customer_crm
# JWT_SECRET=your-secret

# 前端编译
cd /www/wwwroot/customer-crm/frontend
npm run build

# 配置反向代理
宝塔 → 网站 → 反向代理
- 代理地址：http://127.0.0.1:4000
- 代理目录：/api

# 启动应用
cd /www/wwwroot/customer-crm/backend
npm start

# 或配置 PM2 进程管理（推荐）
npm install -g pm2
pm2 start "npm start" --name "crm-backend"
pm2 save
pm2 startup
```

---

## 6. 生产环境检查清单

### 安全
- [ ] JWT_SECRET 已更改为强密钥
- [ ] CORS_ORIGIN 设置为正确的域名
- [ ] 数据库密码已更改
- [ ] HTTPS 已启用
- [ ] 防火墙规则已配置

### 性能
- [ ] 数据库索引已创建
- [ ] Redis 缓存已配置（可选）
- [ ] CDN 已配置（可选）
- [ ] 静态资源压缩已启用
- [ ] 数据库连接池已配置

### 监控与日志
- [ ] 日志收集已配置
- [ ] 错误追踪已设置
- [ ] 性能监控已启用
- [ ] 备份策略已制定
- [ ] 告警规则已设置

### 高可用
- [ ] 数据库备份已配置
- [ ] 负载均衡已设置
- [ ] 故障转移已配置
- [ ] 灾难恢复计划已制定

---

## 7. 故障排除

### 数据库连接失败

```bash
# 检查 PostgreSQL 是否运行
pg_isready -h localhost

# 检查连接字符串
psql postgresql://user:password@localhost/customer_crm

# 查看错误日志
sudo tail -f /var/log/postgresql/postgresql.log
```

### 后端无法启动

```bash
# 检查端口占用
netstat -tlnp | grep 4000

# 清除端口
lsof -ti:4000 | xargs kill -9

# 检查依赖
npm ls

# 重新安装
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 前端白屏

```bash
# 检查浏览器控制台错误 (F12)
# 检查网络请求
# 检查 API_URL 配置

# 重新构建
npm run build

# 清除缓存
# Ctrl + Shift + Delete（浏览器设置）
```

---

## 8. 升级指南

### 备份数据

```bash
# 数据库备份
pg_dump customer_crm > backup.sql

# 应用数据备份
tar -czf app-backup.tar.gz /app
```

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 运行数据库迁移
npx prisma migrate deploy

# 重启服务
pm2 restart crm-backend
```

### 回滚

```bash
# 恢复数据库
psql customer_crm < backup.sql

# 回滚代码
git revert <commit-hash>

# 重启应用
pm2 restart crm-backend
```

---

## 9. 性能优化

### 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_customer_level ON customers(level);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_worklog_date ON work_logs(spent_date);

-- 查询优化
EXPLAIN ANALYZE SELECT * FROM projects WHERE status = 'IN_PROGRESS';
```

### 应用优化

```typescript
// 缓存策略
const cache = new Map();

export async function getCachedProjects(userId: string) {
  const key = `projects:${userId}`;
  if (cache.has(key)) return cache.get(key);

  const projects = await projectService.search({ userId });
  cache.set(key, projects);

  // 5分钟后清除缓存
  setTimeout(() => cache.delete(key), 300000);

  return projects;
}
```

---

## 10. 监控仪表板推荐

- **服务器监控**：Prometheus + Grafana
- **日志聚合**：ELK Stack (Elasticsearch, Logstash, Kibana)
- **错误追踪**：Sentry
- **性能监控**：New Relic / DataDog
- **状态页面**：Statuspage.io

---

**最后更新：** 2026-01-31
