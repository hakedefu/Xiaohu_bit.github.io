# GitHub Pages 部署指南

## 📋 部署策略

你的仓库是 GitHub Pages 仓库，可以托管**静态网站**。我们采用以下策略：

| 组件 | 部署位置 | 方式 |
|------|--------|------|
| **前端应用** | GitHub Pages | ✅ 自动部署 |
| **后端 API** | 外部服务器 | Railway/Render/Heroku |
| **数据库** | PostgreSQL云服务 | Railway/Render/Supabase |

---

## 🚀 步骤 1: 本地准备

### 1.1 克隆你的GitHub仓库到本地
```bash
git clone https://github.com/hakedefu/Xiaohu_bit.github.io.git
cd Xiaohu_bit.github.io
```

### 1.2 复制项目文件到仓库
```bash
# 复制前端
cp -r ../customer-crm/frontend ./

# 复制文档
cp -r ../customer-crm/docs ./
cp ../customer-crm/*.md ./
cp ../customer-crm/docker-compose.yml ./
```

---

## 🌐 步骤 2: 配置前端部署

### 2.1 修改 `frontend/vite.config.ts` 以支持GitHub Pages

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub Pages 根路径
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
})
```

### 2.2 更新 `.env.production` 配置

后端API地址需要指向你部署的服务器：

```env
# .env.production
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## ⚙️ 步骤 3: GitHub Actions 自动化部署

### 3.1 创建 `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build frontend
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_BASE_URL: https://your-backend-api.com/api

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'frontend/dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 3.2 创建此文件
将上面的内容保存到 `.github/workflows/deploy.yml`

---

## 🔧 步骤 4: 后端部署选项

### 选项 A: Railway (推荐 - 最简单)

1. 访问 https://railway.app
2. 创建账户并连接GitHub
3. 新建项目，选择"Deploy from GitHub"
4. 选择 `Xiaohu_bit.github.io` 仓库
5. 配置环境变量：
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```
6. Railway 会自动部署后端

### 选项 B: Render

1. 访问 https://render.com
2. 创建 PostgreSQL 数据库
3. 部署后端服务
4. 配置环境变量
5. 获取后端 URL

### 选项 C: Heroku (需要付费)

参考 `DEPLOYMENT.md` 中的 Heroku 部分

---

## 📝 步骤 5: 更新后端 API 地址

### 5.1 部署后端后获取 URL

例如: `https://your-app.railway.app`

### 5.2 更新前端环境变量

编辑 `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-app.railway.app/api
```

### 5.3 更新GitHub Actions配置

在 `.github/workflows/deploy.yml` 中更新：
```yaml
env:
  VITE_API_BASE_URL: https://your-app.railway.app/api
```

---

## 🚀 步骤 6: 推送到GitHub

```bash
# 初始化git
git init
git add .
git commit -m "Initial commit: CRM application"

# 添加远程仓库
git remote add origin https://github.com/hakedefu/Xiaohu_bit.github.io.git

# 推送到main分支
git branch -M main
git push -u origin main
```

---

## ✅ 验证部署

### 6.1 检查GitHub Actions
1. 打开 https://github.com/hakedefu/Xiaohu_bit.github.io/actions
2. 查看构建状态
3. 等待完成

### 6.2 访问你的网站
- **前端**: https://hakedefu.github.io
- **后端 API**: https://your-backend.railway.app/api

### 6.3 测试功能
```bash
# 测试健康检查
curl https://your-backend.railway.app/api/health

# 测试登录
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## 🔒 安全配置

### 保护敏感信息

**不要** 在代码中提交以下信息：
- `.env` 文件
- 密钥和令牌
- 数据库凭据

### GitHub Secrets 配置

1. 打开 Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   ```
   BACKEND_URL=https://your-backend.railway.app
   API_BASE_URL=https://your-backend.railway.app/api
   ```

3. 在 GitHub Actions 中使用：
   ```yaml
   env:
     VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
   ```

---

## 📊 完整的仓库结构

部署后你的仓库应该如下：

```
Xiaohu_bit.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 配置
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.production
├── backend/                         # 可选，用于参考
│   ├── src/
│   ├── prisma/
│   └── package.json
├── docs/                           # 文档文件夹
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── .gitignore
├── README.md
├── GITHUB_DEPLOYMENT.md           # 本文件
└── docker-compose.yml             # 参考用
```

---

## 🐛 常见问题排查

### 问题 1: 构建失败

**症状**: GitHub Actions 显示红色错误

**解决方案**:
1. 查看 Actions 日志
2. 检查 Node.js 版本匹配
3. 确保 `frontend/package.json` 存在
4. 检查依赖是否正确

### 问题 2: 前端连接不到后端

**症状**: 登录或API调用失败

**解决方案**:
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 验证后端服务已启动
3. 检查 CORS 配置
4. 查看浏览器控制台错误

### 问题 3: CORS 错误

**症状**: 浏览器显示 CORS 错误

**解决方案**:
1. 在后端配置 CORS：
   ```typescript
   app.use(cors({
     origin: 'https://hakedefu.github.io',
     credentials: true
   }))
   ```
2. 重新部署后端
3. 清除浏览器缓存

### 问题 4: 页面刷新显示 404

**症状**: 刷新页面返回 404

**解决方案**:
需要在GitHub Pages上配置重定向，将所有请求指向 `index.html`。

创建 `public/_redirects` 文件（不适用GitHub Pages）

更好的方案是修改 `vite.config.ts`：
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    middlewareMode: true,
  }
})
```

或者在部署时使用 `frontend/dist/index.html` 作为 404 处理

---

## 📚 后续文档

- **API 文档**: 查看 `docs/API.md` 了解所有端点
- **架构文档**: 查看 `docs/ARCHITECTURE.md` 理解系统设计
- **部署选项**: 查看 `DEPLOYMENT.md` 了解其他部署方式

---

## 🎯 快速命令参考

```bash
# 本地测试前端
cd frontend
npm install
npm run dev

# 构建前端
npm run build

# 推送更新到GitHub
git add .
git commit -m "Update: description"
git push origin main

# 查看GitHub Actions日志
# 访问: https://github.com/hakedefu/Xiaohu_bit.github.io/actions
```

---

## ✨ 完成清单

- [ ] 克隆仓库到本地
- [ ] 复制项目文件
- [ ] 创建 `.github/workflows/deploy.yml`
- [ ] 配置 `frontend/.env.production`
- [ ] 部署后端服务（Railway/Render）
- [ ] 获取后端API URL
- [ ] 更新前端 API 地址
- [ ] 推送到GitHub
- [ ] 验证GitHub Actions构建
- [ ] 测试前端应用
- [ ] 测试API连接

---

**需要帮助？** 查看 `GITHUB_DEPLOYMENT.md` 或参考 `ENGINEER_REFERENCE.md` 中的常用命令

**祝部署顺利！** 🚀
