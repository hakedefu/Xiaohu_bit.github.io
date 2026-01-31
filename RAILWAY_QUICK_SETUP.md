# Railway 完整部署配置

本文档提供快速部署后端到Railway的步骤。

## 🎯 后端部署快速步骤（5分钟）

### 1️⃣ 创建Railway项目
- 访问: https://railway.app
- GitHub登录
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择 `Xiaohu_bit.github.io` 仓库

### 2️⃣ 添加PostgreSQL数据库
- 在Railway项目中点击 "+ Add"
- 选择 "PostgreSQL"
- 自动创建数据库

### 3️⃣ 配置环境变量

在Railway中设置这些环境变量：

```
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/crm

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars-random

# CORS
CORS_ORIGIN=https://hakedefu.github.io

# 端口
PORT=4000

# Node环境
NODE_ENV=production
```

### 4️⃣ 配置部署

1. 在Railway中选择 "Node.js" 作为构建方式
2. 设置启动命令: `npm run start`
3. 根目录: `backend`
4. 点击Deploy

### 5️⃣ 获取后端URL

部署完成后，Railway会提供一个URL，格式如：
```
https://your-app-backend.railway.app
```

记下这个URL，后续需要配置到前端。

---

## 🔗 连接前后端

修改 `frontend/.env.production`:

```
VITE_API_BASE_URL=https://your-app-backend.railway.app/api
```

然后推送到GitHub，GitHub Actions会自动重新构建前端。

---

## ✅ 验证部署

1. 访问前端: https://hakedefu.github.io
2. 尝试注册/登录
3. 检查浏览器DevTools的Network标签，确保API调用成功

---

## 🔐 安全建议

- 使用强随机JWT_SECRET
- 不要提交.env文件
- 定期检查Railway的日志

---

## 📞 常见问题

**Q: CORS错误？**
A: 检查Railway中的CORS_ORIGIN环境变量是否正确

**Q: 数据库连接失败？**
A: 确保DATABASE_URL包含正确的PostgreSQL凭证

**Q: API 404错误？**
A: 确保前端的VITE_API_BASE_URL指向正确的Railway URL
