# 30秒快速部署摘要

## 现在的状态

✅ **前端**: 已部署到GitHub Pages
- URL: https://hakedefu.github.io
- 自动部署：有（GitHub Actions）

❌ **后端**: 需要部署到Railway

---

## 后端快速部署（5步 = 10分钟）

### 1️⃣ 访问 Railway
https://railway.app → GitHub登录 → "New Project"

### 2️⃣ 连接仓库
选择 `Xiaohu_bit.github.io` → 授权

### 3️⃣ 添加数据库
点击 "+ Add" → 选择 PostgreSQL → 自动创建

### 4️⃣ 设置环境变量

| 变量 | 值 |
|------|-----|
| DATABASE_URL | (Railway自动生成) |
| JWT_SECRET | 随机32字符字符串 |
| CORS_ORIGIN | https://hakedefu.github.io |
| NODE_ENV | production |
| PORT | 4000 |

### 5️⃣ 部署
点击 Deploy → 等待5-10分钟

---

## 获取后端URL并配置前端

1. Railway部署完成后，获取你的URL
2. 编辑本地: `frontend/.env.production`
3. 修改:
```
VITE_API_BASE_URL=https://你的railway-url/api
```
4. 推送:
```
git add frontend/.env.production
git commit -m "chore: update API URL"
git push
```

---

## ✅ 验证

1. 访问 https://hakedefu.github.io
2. 注册一个账户
3. 登录到Dashboard
4. 如果成功 = 完全部署成功！

---

## 详细指南

📖 完整步骤: [FULL_DEPLOYMENT_GUIDE.md](FULL_DEPLOYMENT_GUIDE.md)

🚂 Railway详细: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

---

**预计总时间: 15-20分钟**
