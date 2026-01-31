# GitHub 部署完整指南

## 📚 目录

1. [部署概览](#部署概览)
2. [快速开始](#快速开始)
3. [完整部署步骤](#完整部署步骤)
4. [验证部署](#验证部署)
5. [常见问题](#常见问题)

---

## 🎯 部署概览

### 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   最终用户访问                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐      ┌───────────────────┐
│  前端应用         │      │  后端 API         │
│ GitHub Pages     │      │  Railway          │
│ hakedefu.github  │      │ your-app.railway  │
│ .io              │      │ .app/api          │
└──────────────────┘      └───────────────────┘
        ▲                         │
        │                         ▼
        │                  ┌───────────────────┐
        │                  │  PostgreSQL       │
        │                  │  数据库(Railway)   │
        │                  └───────────────────┘
        │
  (HTTP请求)
        │
   (Git Push)
        │
┌───────┴────────────────────────────────┐
│     GitHub Repository                   │
│  hakedefu/Xiaohu_bit.github.io         │
│                                        │
│  ├── frontend/        (前端代码)        │
│  ├── backend/         (参考用)          │
│  ├── .github/         (Actions)        │
│  └── docs/            (文档)            │
└────────────────────────────────────────┘
```

---

## ⚡ 快速开始

### 方案A: 使用自动化脚本 (推荐)

**Windows 用户:**
```bash
cd c:\1111\1\customer-crm
deploy-to-github.bat https://github.com/hakedefu/Xiaohu_bit.github.io.git
```

**Mac/Linux 用户:**
```bash
cd /path/to/customer-crm
bash deploy-to-github.sh https://github.com/hakedefu/Xiaohu_bit.github.io.git
```

脚本会自动：
- ✅ 克隆你的GitHub仓库
- ✅ 复制所有项目文件
- ✅ 配置环境变量
- ✅ 初始化Git并提交
- ✅ 推送到GitHub

### 方案B: 手动部署

**1. 克隆仓库到本地**
```bash
git clone https://github.com/hakedefu/Xiaohu_bit.github.io.git
cd Xiaohu_bit.github.io
```

**2. 复制项目文件**
```bash
# 从customer-crm项目复制
cp -r ../customer-crm/frontend ./
cp -r ../customer-crm/.github ./
cp -r ../customer-crm/docs ./
cp ../customer-crm/*.md ./
```

**3. 推送到GitHub**
```bash
git add .
git commit -m "Initial commit: CRM application"
git push -u origin main
```

---

## 📋 完整部署步骤

### 第一阶段: 前端部署 (GitHub Pages)

#### 步骤 1: 验证前端文件

```bash
# 检查前端结构
ls frontend/
# 应该显示: src, public, index.html, package.json, vite.config.ts
```

#### 步骤 2: 验证GitHub Actions配置

```bash
# 检查workflow文件
cat .github/workflows/deploy.yml

# 确保包含以下内容：
# - runs-on: ubuntu-latest
# - uses: actions/setup-node@v4
# - npm run build
# - uses: actions/deploy-pages@v2
```

#### 步骤 3: 启用GitHub Pages

1. 打开 https://github.com/hakedefu/Xiaohu_bit.github.io/settings
2. 左侧菜单选择 **"Pages"**
3. 确保 **Source** 设置为 **"GitHub Actions"**
4. 保存设置

#### 步骤 4: 推送代码触发构建

```bash
git push -u origin main
```

#### 步骤 5: 监控构建

1. 打开 https://github.com/hakedefu/Xiaohu_bit.github.io/actions
2. 查看最新的工作流运行
3. 等待构建完成（通常2-5分钟）
4. 查看构建日志，确保没有错误

#### 步骤 6: 验证前端部署

打开浏览器访问：
```
https://hakedefu.github.io
```

你应该看到登录页面。

---

### 第二阶段: 后端部署 (Railway)

#### 步骤 1: 创建Railway账户

1. 打开 https://railway.app
2. 点击 **"Start Project"**
3. 使用GitHub账户登录

#### 步骤 2: 创建项目

1. 点击 **"Create New Project"**
2. 选择 **"Deploy from GitHub"**
3. 授权Railway访问你的GitHub账户
4. 搜索 `Xiaohu_bit.github.io` 仓库
5. 选择并确认

#### 步骤 3: 添加PostgreSQL数据库

1. 在项目中点击 **"Add"** → **"Database"**
2. 选择 **"PostgreSQL"**
3. Railway会自动创建数据库
4. 从环境变量中记下 `DATABASE_URL`

#### 步骤 4: 配置环境变量

点击后端服务，切换到 **"Variables"** 标签，添加：

| 变量名 | 值 | 说明 |
|-------|-----|-----|
| `DATABASE_URL` | (自动生成) | 数据库连接URL |
| `NODE_ENV` | `production` | 环境 |
| `PORT` | `4000` | 端口 |
| `JWT_SECRET` | `your-super-secret-key` | JWT密钥 |
| `JWT_EXPIRY` | `7d` | 令牌过期时间 |
| `API_URL` | `https://your-app.railway.app` | API根URL |
| `CORS_ORIGIN` | `https://hakedefu.github.io` | 前端CORS源 |

#### 步骤 5: 配置构建设置

1. 打开服务 **"Settings"**
2. 找到 **"Root Directory"** → 设置为 `backend`
3. 找到 **"Start Command"**

根据你的backend结构，设置命令：

```bash
# 如果有build脚本
npm run build && npm start

# 或者直接启动
npm start

# 或者同时运行迁移和启动
npm run migrate:prod && npm start
```

#### 步骤 6: 部署

Railway会自动开始部署。在 **"Logs"** 标签中监控进度。

#### 步骤 7: 获取后端URL

部署完成后：
1. 在Railway项目中找到服务卡片
2. 查看 **"Domain"** 部分
3. 记下类似这样的URL: `https://your-app-12345.railway.app`

---

### 第三阶段: 连接前后端

#### 步骤 1: 更新前端API地址

编辑 `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-app-12345.railway.app/api
```

将 `your-app-12345` 替换为实际的后端域名。

#### 步骤 2: 更新GitHub Actions

编辑 `.github/workflows/deploy.yml`，找到这一行：

```yaml
env:
  VITE_API_BASE_URL: ${{ secrets.API_BASE_URL || 'http://localhost:4000/api' }}
```

改为：

```yaml
env:
  VITE_API_BASE_URL: https://your-app-12345.railway.app/api
```

#### 步骤 3: 提交并推送

```bash
git add .
git commit -m "Update: configure backend API URL for production"
git push
```

#### 步骤 4: 等待GitHub Actions重新部署

1. 打开 Actions 标签
2. 监控新的构建
3. 等待部署完成

---

## ✅ 验证部署

### 1. 检查前端

```bash
# 访问前端应用
curl -I https://hakedefu.github.io

# 应该返回 200 OK
```

### 2. 检查后端健康状态

```bash
# 测试后端
curl https://your-app-12345.railway.app/api/health

# 应该返回: {"status":"ok"}
```

### 3. 测试完整的登录流程

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

# 应该返回包含 JWT token 的响应
```

### 4. 在浏览器中测试

1. 打开 https://hakedefu.github.io
2. 输入登录凭证
3. 点击登录
4. 应该看到仪表板页面

---

## 🐛 常见问题

### 问题 1: GitHub Actions 构建失败

**症状**: Actions 标签显示红色错误

**排查步骤**:
1. 点击失败的 workflow
2. 查看 **"build"** job 的日志
3. 查找错误信息
4. 常见原因：
   - `npm install` 失败 → 检查 package-lock.json
   - `npm run build` 失败 → 检查 vite.config.ts
   - Node版本不匹配 → 更新 actions/setup-node@v4

### 问题 2: 前端页面显示404

**症状**: 访问 https://hakedefu.github.io 显示404

**排查步骤**:
1. 检查 GitHub Pages 是否启用
2. 查看 Actions 是否成功部署
3. 检查 `.github/workflows/deploy.yml` 是否正确
4. 解决方案：
   - 重新运行 workflow
   - 检查 `build` job 中的 `npm run build` 是否成功

### 问题 3: 前端连接不到后端

**症状**: 浏览器显示"无法连接服务器"或API错误

**排查步骤**:
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 检查后端服务是否运行
3. 检查Railway中的Logs
4. 检查CORS配置

解决方案：
```bash
# 1. 验证后端URL
curl https://your-app-12345.railway.app/api/health

# 2. 检查backend/src/app.ts中的CORS配置
# 应该包含:
# app.use(cors({
#   origin: process.env.CORS_ORIGIN,
#   credentials: true
# }))

# 3. 重新部署后端
```

### 问题 4: 数据库连接失败

**症状**: Railway logs 显示"connect ECONNREFUSED"

**排查步骤**:
1. 检查 `DATABASE_URL` 是否设置
2. 检查数据库迁移是否运行
3. 查看Railway的PostgreSQL服务日志

解决方案：
```bash
# 在Railway中运行迁移
npm run migrate:prod

# 或者重新启动服务
```

### 问题 5: 页面刷新后显示404

**症状**: 访问 https://hakedefu.github.io 正常，但刷新或直接访问路由显示404

**原因**: GitHub Pages 不支持客户端路由

**解决方案**: 使用 Netlify 或 Vercel 而不是 GitHub Pages

---

## 📊 部署架构总结

| 组件 | 位置 | 服务商 | URL |
|------|------|--------|-----|
| 前端应用 | GitHub Pages | GitHub | https://hakedefu.github.io |
| 后端API | Railway | Railway | https://your-app.railway.app |
| 数据库 | PostgreSQL | Railway | (内部连接) |
| 代码仓库 | GitHub | GitHub | github.com/hakedefu/Xiaohu_bit.github.io |
| 部署流程 | GitHub Actions | GitHub | (自动) |

---

## 🔐 安全建议

1. **环境变量**: 在Railway中设置敏感信息，不要提交到Git
2. **JWT密钥**: 使用强随机值，定期更换
3. **CORS配置**: 只允许你的前端域名
4. **HTTPS**: 确保所有连接使用HTTPS
5. **数据备份**: 定期备份Railroad中的数据库

---

## 📞 获取帮助

如果遇到问题：

1. **查看日志**:
   - GitHub Actions: https://github.com/hakedefu/Xiaohu_bit.github.io/actions
   - Railway: Railway项目 → Logs

2. **参考文档**:
   - GitHub Deployment: 查看 `GITHUB_DEPLOYMENT.md`
   - Railway Deployment: 查看 `RAILWAY_DEPLOYMENT.md`
   - API Documentation: 查看 `docs/API.md`

3. **在线资源**:
   - GitHub Pages: https://docs.github.com/pages
   - Railway: https://docs.railway.app
   - Vite: https://vitejs.dev

---

## 🎉 部署完成清单

使用此清单确保所有步骤完成：

### 前端
- [ ] 代码已推送到GitHub
- [ ] GitHub Pages 已启用
- [ ] GitHub Actions 工作流已创建
- [ ] 构建成功完成
- [ ] 前端应用可访问

### 后端
- [ ] Railway 项目已创建
- [ ] PostgreSQL 数据库已创建
- [ ] 环境变量已配置
- [ ] 后端服务已部署
- [ ] 数据库迁移已运行

### 集成
- [ ] 前端 API URL 已配置
- [ ] GitHub Actions 已更新
- [ ] CORS 已配置
- [ ] 登录流程已测试
- [ ] 所有功能已验证

---

## 🚀 下一步

部署完成后，你可以：

1. **添加自定义域名**
   - GitHub Pages: 在 Settings → Pages 中配置
   - Railway: 升级付费计划获得自定义域

2. **设置监控告警**
   - Railway: 配置 Metrics 和 Alerts

3. **持续开发**
   - 在本地修改代码
   - 推送到GitHub
   - 自动重新部署

4. **扩展功能**
   - 添加更多页面
   - 实现实时功能（WebSocket）
   - 添加文件上传
   - 集成支付系统

---

**祝部署顺利！** 🎉
