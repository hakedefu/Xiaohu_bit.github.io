# Railway 后端部署指南

## 🚀 什么是 Railway？

Railway 是一个现代的云平台，可以一键部署应用和数据库。

**优势**:
- ✅ 一键部署
- ✅ 集成 PostgreSQL 数据库
- ✅ 自动SSL证书
- ✅ GitHub 直接连接
- ✅ 免费额度充足
- ✅ 简单的环境变量管理

---

## 📋 前置条件

- GitHub 账户
- 本项目的GitHub仓库
- 5分钟时间

---

## 🔧 部署步骤

### 步骤 1: 访问 Railway

打开 https://railway.app，使用 GitHub 账户登录

### 步骤 2: 创建新项目

1. 点击 **"Create New Project"**
2. 选择 **"Deploy from GitHub"**
3. 点击 **"GitHub 授权"** 按钮
4. 允许 Railway 访问你的 GitHub 账户

### 步骤 3: 选择仓库

1. 搜索 `Xiaohu_bit.github.io`
2. 点击选择该仓库
3. 选择 `main` 或 `master` 分支

### 步骤 4: 添加 PostgreSQL 数据库

1. 点击 **"Add"** → **"Database"**
2. 选择 **"PostgreSQL"**
3. Railway 会自动创建数据库
4. 记下数据库 URL

### 步骤 5: 配置环境变量

在Railway项目中，点击你的应用服务，找到 **"Variables"** 部分，添加以下环境变量：

```env
# 数据库连接
DATABASE_URL=postgresql://...  # Railway 会自动生成

# 应用配置
NODE_ENV=production
PORT=4000

# JWT配置
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=7d

# API配置
API_URL=https://your-app-name.railway.app
CORS_ORIGIN=https://hakedefu.github.io

# 日志级别
LOG_LEVEL=info
```

### 步骤 6: 配置根目录

1. 点击应用的 **"Settings"**
2. 找到 **"Root Directory"** 设置
3. 设置为 `backend` （因为后端代码在backend文件夹中）

### 步骤 7: 配置启动命令

在 **"Deploy"** 部分，设置启动命令：

```bash
# 确保使用正确的启动脚本
npm run migrate:prod && npm start

# 或者如果backend/package.json中定义了scripts
npm run build && npm start
```

---

## ✅ 验证部署

### 获取你的后端 URL

1. 打开 Railway 项目
2. 在应用卡片中找到 **"Domain"** 部分
3. 记下像这样的URL：`https://your-app-12345.railway.app`

### 测试后端API

```bash
# 测试健康检查
curl https://your-app-12345.railway.app/api/health

# 应该返回:
# {"status":"ok"}
```

### 获取日志

点击应用卡片上的 **"Logs"** 标签查看实时日志

---

## 🔗 更新前端配置

现在你有了后端 URL，需要更新前端配置：

### 1. 更新本地文件

编辑 `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://your-app-12345.railway.app/api
```

编辑 `.github/workflows/deploy.yml`:

```yaml
env:
  VITE_API_BASE_URL: https://your-app-12345.railway.app/api
```

### 2. 推送更新

```bash
git add .
git commit -m "feat: update backend API URL for production"
git push origin main
```

GitHub Actions 会自动重新构建和部署前端

---

## 📊 验证完整部署

### 1. 前端应该在这里运行
https://hakedefu.github.io

### 2. 后端API在这里
https://your-app-12345.railway.app/api

### 3. 测试完整流程

```bash
# 1. 注册用户
curl -X POST https://your-app-12345.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# 2. 登录
curl -X POST https://your-app-12345.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 3. 返回的响应应该包含 JWT token
```

---

## 💰 费用

Railway 的免费额度：
- **$5/月** 免费额度（通常足够个人项目）
- 超出部分按使用量计费
- 数据库存储：免费 5GB

---

## 🚨 常见问题

### 问题 1: 构建失败

**检查清单**:
1. ✅ `backend/package.json` 存在
2. ✅ Node 版本为 18+
3. ✅ `backend/server.js` 或 `backend/src/index.ts` 存在
4. ✅ 环境变量已设置

### 问题 2: 应用启动后立即崩溃

**检查清单**:
1. ✅ `DATABASE_URL` 环境变量已设置
2. ✅ 数据库迁移已运行
3. ✅ 查看 Logs 标签获取详细错误
4. ✅ 确保启动命令正确

### 问题 3: 连接不到数据库

**解决方案**:
```bash
# 在Railway中运行迁移
npm run migrate:prod

# 或者重新启动应用
```

### 问题 4: 前端无法连接后端

**检查**:
1. ✅ `VITE_API_BASE_URL` 已设置正确
2. ✅ 后端 CORS 已配置：`CORS_ORIGIN=https://hakedefu.github.io`
3. ✅ 后端服务已启动（查看Logs）
4. ✅ 清除浏览器缓存

---

## 📈 监控和维护

### 查看应用指标

1. 打开 Railway 项目
2. 点击 **"Metrics"** 标签
3. 查看 CPU、内存、网络使用情况

### 查看数据库

1. 点击 PostgreSQL 服务卡片
2. 查看数据库连接数和大小
3. 点击 **"Data"** 标签查看表和数据

### 配置告警

1. 项目设置 → **"Alerts"**
2. 添加告警规则（如内存过高）
3. 设置通知方式（Email）

---

## 🔄 更新部署

当你更新代码时：

```bash
# 1. 在本地修改代码
# 2. 提交到GitHub
git add .
git commit -m "update: description"
git push origin main

# 3. Railway 会自动检测更新并重新部署
# 4. 查看 Logs 标签查看部署进度
# 5. 完成后自动生效
```

---

## 🎯 下一步

1. ✅ 部署后端到 Railway
2. ✅ 更新前端 API 地址
3. ✅ 测试完整的登录流程
4. ✅ 在浏览器测试所有功能
5. 📱 考虑部署移动端应用（下一阶段）

---

## 📞 获取帮助

- Railway 文档: https://docs.railway.app
- 部署常见问题: 查看 `ENGINEER_REFERENCE.md`
- API 文档: 查看 `docs/API.md`

---

**祝部署成功！** 🚀
