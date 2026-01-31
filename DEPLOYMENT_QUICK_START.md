# 🚀 GitHub 部署快速参考

> 快速查看如何将你的CRM应用部署到GitHub Pages + Railway

---

## 📝 部署清单 (5分钟快速版)

### ✅ 第1步: 本地准备 (1分钟)

```bash
# Windows
cd c:\1111\1\customer-crm
deploy-to-github.bat https://github.com/hakedefu/Xiaohu_bit.github.io.git

# Mac/Linux
bash deploy-to-github.sh https://github.com/hakedefu/Xiaohu_bit.github.io.git
```

### ✅ 第2步: GitHub Pages 自动激活 (1分钟)

1. 打开 GitHub Actions: https://github.com/hakedefu/Xiaohu_bit.github.io/actions
2. 等待构建完成 ⏳ (2-5分钟)
3. 前端自动部署到: **https://hakedefu.github.io** ✅

### ✅ 第3步: 部署后端到Railway (2分钟)

1. 打开 https://railway.app
2. 用GitHub账户登录
3. 创建项目 → 选择 `Xiaohu_bit.github.io` 仓库
4. 添加 PostgreSQL 数据库
5. 配置环境变量 (见下方)
6. 获取后端URL: `https://your-app-xxxxx.railway.app`

### ✅ 第4步: 连接前后端 (1分钟)

编辑 `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-app-xxxxx.railway.app/api
```

更新 `.github/workflows/deploy.yml`:
```yaml
env:
  VITE_API_BASE_URL: https://your-app-xxxxx.railway.app/api
```

提交：
```bash
git add .
git commit -m "Update backend API URL"
git push
```

### ✅ 完成！

- 前端: https://hakedefu.github.io ✅
- 后端: https://your-app-xxxxx.railway.app/api ✅

---

## 🔧 Railway 环境变量速查表

复制粘贴到Railway的Variables中：

```
DATABASE_URL=postgresql://...  [Railway自动生成]
NODE_ENV=production
PORT=4000
JWT_SECRET=change-me-to-random-secret-key
JWT_EXPIRY=7d
API_URL=https://your-app-xxxxx.railway.app
CORS_ORIGIN=https://hakedefu.github.io
LOG_LEVEL=info
```

---

## 🧪 快速测试命令

```bash
# 1️⃣ 测试后端健康
curl https://your-app-xxxxx.railway.app/api/health

# 2️⃣ 测试注册
curl -X POST https://your-app-xxxxx.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test"}'

# 3️⃣ 测试登录
curl -X POST https://your-app-xxxxx.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 4️⃣ 在浏览器打开
# https://hakedefu.github.io
```

---

## 🆘 3个常见问题速查

### ❓ GitHub Actions 失败？

```bash
# 查看日志
# https://github.com/hakedefu/Xiaohu_bit.github.io/actions

# 可能原因:
1. package.json 缺少依赖
2. vite.config.ts 配置错误
3. 环境变量未设置

# 解决: 检查日志 → 修复 → 重新推送
```

### ❓ 前端连不到后端？

```bash
# 检查清单:
1. VITE_API_BASE_URL 设置正确吗？
2. 后端 CORS 允许 https://hakedefu.github.io 吗？
3. 后端服务正在运行吗？

# 查看railway日志验证后端运行状态
```

### ❓ Railway 构建失败？

```bash
# 查看 Railway Logs 标签
# 通常原因:
1. DATABASE_URL 环境变量缺失
2. 启动命令错误
3. 数据库迁移失败

# 解决: 修复后重启应用
```

---

## 📊 部署完成后的架构

```
┌─────────────────────────────────┐
│   https://hakedefu.github.io    │
│  (前端 - GitHub Pages)           │
│  React + Vite + Ant Design      │
└──────────────┬──────────────────┘
               │ HTTP 请求
               ▼
┌─────────────────────────────────┐
│ https://your-app.railway.app    │
│  (后端 API - Railway)            │
│  Node.js + Express + PostgreSQL │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────────┐
        │ PostgreSQL   │
        │  数据库      │
        └──────────────┘
```

---

## 💾 关键文件清单

| 文件 | 用途 | 位置 |
|------|------|------|
| `deploy.yml` | GitHub Actions工作流 | `.github/workflows/` |
| `.env.production` | 生产环境配置 | `frontend/` |
| `vite.config.ts` | 前端构建配置 | `frontend/` |
| `server.js` | 后端启动文件 | `backend/` |
| `package.json` | 后端依赖 | `backend/` |
| `prisma/schema.prisma` | 数据库结构 | `backend/prisma/` |

---

## ⏱️ 预期时间表

| 步骤 | 所需时间 | 说明 |
|------|--------|------|
| 运行部署脚本 | 1 分钟 | 自动化脚本 |
| 首次 GitHub Actions | 5 分钟 | 首次构建较慢 |
| Railway 部署 | 3 分钟 | 取决于网络 |
| 整体耗时 | **15 分钟** | 平均总时间 |

---

## 📞 完整文档

需要详细步骤？查看：

- 📖 **GITHUB_DEPLOYMENT.md** - GitHub Pages部署详解
- 📖 **RAILWAY_DEPLOYMENT.md** - Railway部署详解  
- 📖 **COMPLETE_DEPLOYMENT_GUIDE.md** - 完整部署指南
- 📖 **docs/API.md** - API文档
- 📖 **ENGINEER_REFERENCE.md** - 工程师参考

---

## 🎯 部署完成验证

```bash
# ✅ 前端正常
[ ] 能访问 https://hakedefu.github.io
[ ] 看到登录页面
[ ] 没有控制台错误

# ✅ 后端正常
[ ] curl health 返回 200
[ ] 能成功注册用户
[ ] 能成功登录
[ ] 仪表板加载正常

# ✅ 集成正常
[ ] 点击登录能到仪表板
[ ] 加载客户列表成功
[ ] 创建新项目成功
```

---

## 🔐 最后的安全提醒

```bash
# ❌ 不要做:
- 提交 .env 文件到Git
- 在代码中硬编码密钥
- 使用简单的JWT_SECRET

# ✅ 要做:
- 在Railway中设置环境变量
- 使用强随机密钥
- 定期更换JWT_SECRET
- 限制CORS_ORIGIN到你的域名
```

---

**2分钟快速开始？** 向上滚动查看"5分钟快速版"

**需要详细步骤？** 打开 `COMPLETE_DEPLOYMENT_GUIDE.md`

**遇到问题？** 查看"3个常见问题速查"

---

**祝部署顺利！🚀**
