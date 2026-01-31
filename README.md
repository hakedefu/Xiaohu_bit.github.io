# 客户管理与技术员协作系统 - 快速开始指南

## 📋 项目概述

这是一个企业级的客户管理系统（CRM），支持客户生命周期管理、项目可视化看板、智能搜索和工作日志功能。

**核心特性：**
- ✅ 完整的客户生命周期管理（售前→售中→售后→完成→存档）
- ✅ 四象限项目看板（重要紧急/重要不紧急/紧急不重要/不紧急不重要）
- ✅ 多条件智能搜索系统
- ✅ 独立的工作日志时间线
- ✅ JWT 认证 + 角色权限控制
- ✅ 完整的 TypeScript 类型定义

---

## 🚀 快速启动（本地开发）

### 前置要求

- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 1. 数据库设置

```bash
# Windows PowerShell
# 创建数据库
psql -U postgres -c "CREATE DATABASE customer_crm;"

# 或使用 pgAdmin 图形界面创建
```

### 2. 后端启动

```bash
cd customer-crm/backend

# 复制环境配置
Copy-Item .env.example .env

# 编辑 .env 文件，配置数据库连接
# DATABASE_URL=postgresql://user:password@localhost:5432/customer_crm

# 安装依赖
npm install --legacy-peer-deps

# 运行数据库迁移
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npm run prisma:generate

# 启动开发服务器
npm run dev
# 服务器运行在 http://localhost:4000
```

### 3. 前端启动

```bash
cd customer-crm/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 应用运行在 http://localhost:5173
```

### 4. 访问应用

打开浏览器访问：http://localhost:5173

**测试账户：**
- 邮箱：`user@example.com`
- 密码：`password123`

（需要先注册账户）

---

## 🏗️ 项目结构

```
customer-crm/
├── backend/                          # 后端 API
│   ├── src/
│   │   ├── config/                   # 配置文件
│   │   ├── controllers/              # 请求处理器
│   │   ├── middleware/               # 中间件（认证、错误）
│   │   ├── models/                   # 数据模型
│   │   ├── routes/                   # API 路由
│   │   ├── services/                 # 业务逻辑服务
│   │   ├── types/                    # TypeScript 类型
│   │   ├── utils/                    # 工具函数
│   │   ├── app.ts                    # Express 应用
│   │   └── index.ts                  # 入口文件
│   ├── prisma/
│   │   └── schema.prisma             # 数据库 schema
│   ├── tests/                        # 单元测试
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                         # 前端应用
│   ├── src/
│   │   ├── components/               # React 组件
│   │   ├── pages/                    # 页面组件
│   │   ├── store/                    # Redux 存储
│   │   ├── services/                 # API 服务
│   │   ├── types/                    # TypeScript 类型
│   │   ├── utils/                    # 工具函数
│   │   ├── styles/                   # 全局样式
│   │   ├── App.tsx                   # 主应用组件
│   │   └── main.tsx                  # 入口文件
│   ├── public/                       # 静态资源
│   ├── package.json
│   └── Dockerfile
│
├── docs/                             # 文档
│   ├── API.md                        # API 文档
│   ├── DATABASE.md                   # 数据库设计
│   └── ARCHITECTURE.md               # 架构文档
│
├── docker-compose.yml                # Docker 编排
└── README.md                         # 项目说明
```

---

## 📱 核心页面

### 1. 登录/注册页面
- 用户认证
- JWT 令牌管理
- 会话恢复

### 2. 仪表板（Dashboard）
- 项目统计卡片（总数、已完成、逾期、即将到期）
- 最近项目列表
- 快速访问常用功能

### 3. 客户管理（Customers）
- 客户列表（分页、排序）
- 客户详情（姓名、公司、等级、状态）
- CRUD 操作
- 按等级/状态/时间范围搜索

### 4. 项目看板（Projects）
- 四象限视图
- 拖拽更新状态
- 时间预警（红/黄/绿）
- 快速状态变更

### 5. 高级搜索（Search）
- 多条件组合查询
- 搜索模板保存
- 模糊搜索和精确搜索

### 6. 工作日志（Work Logs）
- 项目时间线
- 日志添加/编辑/删除
- 工作类型标签
- 工时统计

---

## 🔌 API 端点

### 认证
```
POST   /api/auth/register              # 用户注册
POST   /api/auth/login                 # 用户登录
GET    /api/auth/me                    # 获取当前用户
PUT    /api/auth/profile               # 更新个人资料
POST   /api/auth/change-password       # 修改密码
```

### 客户
```
POST   /api/customers                  # 创建客户
GET    /api/customers                  # 获取客户列表（分页）
GET    /api/customers/search           # 搜索客户
GET    /api/customers/stats            # 客户统计
GET    /api/customers/:id              # 获取客户详情
PUT    /api/customers/:id              # 更新客户
DELETE /api/customers/:id              # 删除客户
```

### 项目
```
POST   /api/projects                   # 创建项目
GET    /api/projects/search            # 搜索项目
GET    /api/projects/quadrant          # 获取四象限数据
GET    /api/projects/stats             # 项目统计
GET    /api/projects/:id               # 获取项目详情
PUT    /api/projects/:id               # 更新项目
PATCH  /api/projects/:id/status        # 更新项目状态
PATCH  /api/projects/:id/quadrant      # 更新项目象限
```

### 工作日志
```
POST   /api/work-logs                  # 创建工作日志
GET    /api/work-logs/project/:id      # 获取项目的工作日志
GET    /api/work-logs/user/:id         # 获取用户的工作日志
GET    /api/work-logs/date-range       # 获取日期范围内的工作日志
GET    /api/work-logs/stats            # 工作日志统计
GET    /api/work-logs/:id              # 获取工作日志详情
PUT    /api/work-logs/:id              # 更新工作日志
DELETE /api/work-logs/:id              # 删除工作日志
```

---

## 🗄️ 数据库设计

### 主要表结构

#### users（用户表）
```sql
- id (UUID)
- email (UNIQUE)
- username (UNIQUE)
- password (hashed)
- fullName
- role (ADMIN, MANAGER, STAFF)
- department
- avatar
- phone
- isActive
- createdAt, updatedAt
```

#### customers（客户表）
```sql
- id (UUID)
- name
- email
- phone
- company
- level (S, A, B, C)
- status (PROSPECT, SUPPORTING, MAINTENANCE, COMPLETED, ARCHIVED)
- tags (Array)
- notes
- createdBy (FK -> users)
- createdAt, updatedAt
```

#### projects（项目表）
```sql
- id (UUID)
- title
- description
- customerId (FK -> customers)
- assignedToId (FK -> users)
- priority (LOW, MEDIUM, HIGH, URGENT)
- status (BACKLOG, TODO, IN_PROGRESS, REVIEW, COMPLETED, BLOCKED, CANCELLED)
- quadrant (IMPORTANT_URGENT, IMPORTANT_NOT_URGENT, NOT_IMPORTANT_URGENT, NOT_IMPORTANT_NOT_URGENT)
- dueDate
- estimatedHours, actualHours
- tags (Array)
- attachments (Array)
- createdAt, updatedAt
```

#### work_logs（工作日志表）
```sql
- id (UUID)
- projectId (FK -> projects)
- userId (FK -> users)
- title
- description
- workType (DEVELOPMENT, TESTING, DOCUMENTATION, MEETING, SUPPORT, DEBUGGING, REVIEW, OTHER)
- duration (minutes)
- spentDate
- tags (Array)
- attachments (Array)
- createdAt, updatedAt
```

---

## 🔐 认证与权限

### JWT 实现
```typescript
// 令牌内容
{
  userId: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
}

// 过期时间：7天
// 使用方式：Authorization: Bearer <token>
```

### 权限控制
- ADMIN：完全访问
- MANAGER：管理自己的项目和团队
- STAFF：访问分配的项目

---

## 🧪 测试

### 后端单元测试
```bash
cd backend
npm run test              # 运行所有测试
npm run test:watch       # 监视模式
```

### 前端组件测试
```bash
cd frontend
npm run test              # 运行所有测试
npm run test:ui          # UI 测试界面
```

---

## 🐳 Docker 部署

### 使用 Docker Compose

```bash
# 构建并启动所有服务
docker-compose up --build

# 运行数据库迁移
docker-compose exec backend npm run migrate:prod

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境配置

创建 `.env.production` 文件：
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@db-host:5432/customer_crm
JWT_SECRET=<strong-secret-key>
CORS_ORIGIN=https://yourdomain.com
```

---

## 📊 性能优化

### 后端优化
- 数据库查询优化（索引、关联加载）
- 分页查询限制
- 缓存策略
- 错误处理和日志记录

### 前端优化
- 代码分割和懒加载
- 组件记忆化（React.memo）
- Redux 状态管理
- CSS 模块化

---

## 🚨 常见问题

### Q1: 数据库连接失败
```bash
# 检查 PostgreSQL 是否运行
pg_isready -h localhost

# 验证连接字符串
psql -h localhost -U user -d customer_crm
```

### Q2: 前端无法连接后端
```bash
# 检查后端是否运行
curl http://localhost:4000/health

# 检查 CORS 配置（backend/.env）
CORS_ORIGIN=http://localhost:5173
```

### Q3: JWT 令牌过期
令牌过期时自动清除本地存储并重定向到登录页。需要重新登录。

---

## 📝 开发规范

### 命名规则
- 组件：PascalCase（Dashboard.tsx）
- 函数/变量：camelCase（handleLogin）
- 常量：UPPER_SNAKE_CASE（API_BASE_URL）
- 文件夹：lowercase（services, utils）

### Git 提交规范
```
feat: 新功能
fix: 错误修复
docs: 文档更新
refactor: 代码重构
test: 测试
chore: 构建、依赖等
```

---

## 📚 有用的链接

- [Ant Design 文档](https://ant.design/components/overview-cn/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Express.js 文档](https://expressjs.com/)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Redux 文档](https://redux.js.org/)

---

## 📞 支持

如有问题或建议，请提交 Issue 或联系技术团队。

---

**最后更新：** 2026-01-31  
**版本：** v1.0.0
