# 💡 工程师参考卡

## 快速命令速查

### 后端启动

```bash
cd backend

# 开发模式
npm run dev

# 生产构建
npm run build
npm start

# 数据库迁移
npx prisma migrate dev --name <migration-name>
npx prisma migrate deploy
npx prisma migrate reset

# 生成 Prisma 客户端
npm run prisma:generate

# 数据库相关
npx prisma studio  # 图形化数据库管理
```

### 前端启动

```bash
cd frontend

# 开发模式
npm run dev

# 生产构建
npm run build
npm run preview

# 测试
npm run test
npm run test:ui

# 类型检查
npm run type-check
```

### Docker 操作

```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps
docker-compose logs -f

# 执行命令
docker-compose exec backend npm run migrate:prod
docker-compose exec backend sh

# 停止服务
docker-compose down
docker-compose down -v  # 删除所有数据
```

---

## 常见开发任务

### 添加新 API 端点

**1. 创建服务方法** (`backend/src/services/xxx.service.ts`)
```typescript
async createXxx(data: any) {
  return await prisma.xxx.create({ data });
}
```

**2. 创建控制器** (`backend/src/controllers/xxx.controller.ts`)
```typescript
export const createXxx = asyncHandler(async (req, res) => {
  const xxx = await xxxService.create(req.body);
  res.status(201).json({ success: true, data: xxx });
});
```

**3. 添加路由** (`backend/src/routes/xxx.routes.ts`)
```typescript
router.post('/', authMiddleware, createXxx);
```

**4. 主应用注册** (`backend/src/app.ts`)
```typescript
app.use('/api/xxx', xxxRoutes);
```

### 添加新页面组件

**1. 创建页面** (`frontend/src/pages/NewPage.tsx`)
```typescript
import React from 'react';

const NewPage: React.FC = () => {
  return <div>新页面内容</div>;
};

export default NewPage;
```

**2. 添加路由** (`frontend/src/App.tsx`)
```typescript
<Route path="/new-page" element={<NewPage />} />
```

**3. 添加菜单项** (`frontend/src/components/Layout.tsx`)
```typescript
{
  key: 'new-page',
  icon: <IconComponent />,
  label: '新页面',
  onClick: () => navigate('/new-page'),
}
```

### 修改数据库 Schema

```bash
# 1. 编辑 prisma/schema.prisma
# 2. 创建迁移
npx prisma migrate dev --name add_new_field

# 3. 自动应用到数据库
# （迁移会被自动应用）

# 4. 更新前端类型定义
# frontend/src/types/index.ts
```

---

## 测试常用操作

### 后端测试用户登录

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 获取令牌后访问受保护的 API

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### 创建测试项目

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"测试项目",
    "customerId":"cust-id",
    "assignedToId":"user-id",
    "priority":"HIGH",
    "quadrant":"IMPORTANT_URGENT",
    "dueDate":"2026-02-28"
  }'
```

---

## 环境变量配置

### 后端 (.env)
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/customer_crm
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

### 前端 (.env.local)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 数据库常用查询

### 查看表结构
```bash
npx prisma studio  # 图形界面
```

### 查询示例

```sql
-- 统计客户
SELECT level, COUNT(*) FROM customers GROUP BY level;

-- 查询逾期项目
SELECT * FROM projects 
WHERE status != 'COMPLETED' AND "dueDate" < NOW();

-- 统计工作日志
SELECT work_type, SUM(duration) FROM work_logs 
GROUP BY work_type;
```

---

## Git 工作流

```bash
# 创建新分支
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "feat: add new feature"

# 推送分支
git push origin feature/new-feature

# 创建 PR 并合并
# 从 GitHub 创建 Pull Request

# 同步主分支
git checkout main
git pull origin main
```

---

## 调试技巧

### 后端调试
```bash
# 启用详细日志
DEBUG=* npm run dev

# 使用 VS Code 调试器
# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/ts-node/dist/index.js",
      "args": ["src/index.ts"],
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### 前端调试
```bash
# React DevTools 浏览器扩展
# Redux DevTools 浏览器扩展
# VS Code - JavaScript Debugger

# 在浏览器控制台
localStorage.getItem('token')  # 查看令牌
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  # Redux 工具
```

---

## 性能分析

### 后端性能
```bash
# 查看 API 响应时间
npm run dev  # 查看日志中的响应时间

# 数据库查询分析
EXPLAIN ANALYZE SELECT ...;
```

### 前端性能
```bash
# 使用 Lighthouse
# Chrome DevTools → Lighthouse → 分析页面加载

# 使用 Performance API
performance.mark('event-name');
// ... 代码 ...
performance.measure('event-name');
```

---

## 常见错误修复

| 错误 | 解决方案 |
|------|--------|
| `EADDRINUSE` | `lsof -ti:4000 \| xargs kill -9` |
| 数据库连接失败 | 检查 `DATABASE_URL` 配置 |
| JWT 过期 | 清除 localStorage，重新登录 |
| CORS 错误 | 检查后端 `CORS_ORIGIN` 配置 |
| 类型错误 | 运行 `npm run type-check` |

---

## 项目重要文件

```
backend/
├── src/app.ts              # Express 主应用
├── src/index.ts            # 服务器入口
├── src/config/index.ts     # 配置文件
└── prisma/schema.prisma    # 数据库 schema

frontend/
├── src/App.tsx             # 主应用组件
├── src/main.tsx            # 入口文件
├── src/store/index.ts      # Redux 存储
└── vite.config.ts          # Vite 配置

docs/
├── API.md                  # API 文档
├── ARCHITECTURE.md         # 架构文档
└── DEPLOYMENT.md           # 部署指南
```

---

## 代码规范

### 提交信息规范
```
feat: 新功能
fix: 错误修复
docs: 文档
style: 代码风格
refactor: 代码重构
test: 测试
chore: 构建、依赖
```

### 文件命名规范
- 组件：PascalCase (Dashboard.tsx)
- 函数/变量：camelCase (handleClick)
- 常量：UPPER_SNAKE_CASE (MAX_SIZE)
- 文件夹：lowercase (components)

### TypeScript 类型规范
```typescript
// ✅ 好的做法
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ 避免使用 any
function process(data: any) {}

// ✅ 使用泛型
function process<T>(data: T): T {}
```

---

## 有用的链接

- [项目主文档](./PROJECT_OVERVIEW.md)
- [API 文档](docs/API.md)
- [架构文档](docs/ARCHITECTURE.md)
- [部署指南](docs/DEPLOYMENT.md)
- [后端 README](backend/README.md)
- [前端 README](frontend/README.md)

---

**最后更新：** 2026-01-31
