# 架构设计文档

## 系统架构概述

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     客户端浏览器                              │
│              (React 18 + TypeScript + Ant Design)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    HTTP/HTTPS (REST)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Nginx)                         │
│         - 静态资源服务                                        │
│         - API 代理 (/api → Backend)                         │
│         - 缓存策略                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express.js)                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              认证中间件 (JWT)                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │         路由层 (Controllers) ← 请求处理             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │         业务层 (Services) ← 业务逻辑               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │         数据层 (Prisma ORM) ← 数据访问             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │           错误处理中间件                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL 数据库 (14+)                         │
│                                                               │
│  - Users（用户表）                                          │
│  - Customers（客户表）                                      │
│  - Projects（项目表）                                       │
│  - WorkLogs（工作日志表）                                   │
│  - ProjectComments（项目评论表）                            │
│  - SearchTemplates（搜索模板表）                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 分层架构详解

### 1. 前端分层

```
src/
├── pages/              # 页面层
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Customers.tsx
│   └── Projects.tsx
│
├── components/         # 组件层
│   ├── Layout.tsx      # 布局组件
│   ├── CustomerForm.tsx
│   └── ProjectCard.tsx
│
├── store/              # 状态管理层
│   ├── slices/         # Redux slice
│   └── index.ts        # Store 配置
│
├── services/           # API 服务层
│   └── api.ts          # 与后端通信
│
├── hooks/              # 自定义钩子
│   └── useAuth.ts
│
├── types/              # 类型定义
│   └── index.ts
│
├── utils/              # 工具函数
│   └── format.ts
│
└── styles/             # 全局样式
    └── index.css
```

### 2. 后端分层

```
backend/src/
├── controllers/        # 控制层 - 处理HTTP请求
│   ├── auth.controller.ts
│   ├── customer.controller.ts
│   ├── project.controller.ts
│   └── work-log.controller.ts
│
├── services/          # 服务层 - 业务逻辑
│   ├── auth.service.ts
│   ├── customer.service.ts
│   ├── project.service.ts
│   └── work-log.service.ts
│
├── middleware/        # 中间件层
│   ├── auth.ts        # JWT认证
│   └── errorHandler.ts # 错误处理
│
├── routes/            # 路由层
│   ├── auth.routes.ts
│   ├── customer.routes.ts
│   ├── project.routes.ts
│   └── work-log.routes.ts
│
├── models/            # 数据模型 (Prisma)
│   └── prisma/schema.prisma
│
├── types/             # TypeScript 类型
│   └── index.ts
│
├── utils/             # 工具函数
│   └── errors.ts
│
├── config/            # 配置
│   └── index.ts
│
├── app.ts             # Express 应用配置
└── index.ts           # 服务器入口
```

---

## 数据流分析

### 认证流程

```
1. 用户输入凭证 (Login.tsx)
   ↓
2. API 调用 (apiClient.post('/auth/login'))
   ↓
3. 后端验证 (auth.controller.ts → authService.login())
   ↓
4. 生成 JWT (createToken())
   ↓
5. 前端存储令牌 (localStorage + Redux)
   ↓
6. 后续请求附带令牌 (axios interceptor)
   ↓
7. 验证中间件 (authMiddleware)
   ↓
8. 授予访问权限 (req.user 可用)
```

### 创建项目流程

```
1. 用户填表 (ProjectForm.tsx)
   ↓
2. 表单验证
   ↓
3. 提交 API 请求 (projectApi.create)
   ↓
4. 后端路由处理 (POST /api/projects)
   ↓
5. 认证中间件验证
   ↓
6. 控制器处理 (createProject controller)
   ↓
7. 业务逻辑 (projectService.createProject)
   ↓
8. 数据库写入 (Prisma ORM)
   ↓
9. PostgreSQL 持久化
   ↓
10. 返回响应
   ↓
11. 更新前端状态 (Redux dispatch)
   ↓
12. UI 更新
```

---

## 安全考虑

### 1. 认证与授权
- JWT 令牌基于的认证方式
- 令牌过期后自动刷新
- 角色基访问控制 (RBAC)
- 密码使用 bcrypt 加密

### 2. API 安全
- CORS 配置限制
- 输入验证和消毒
- SQL 注入防护 (使用 ORM)
- 错误消息不泄露敏感信息

### 3. 数据保护
- 敏感数据不在响应中返回（如密码）
- HTTPS 用于生产环境
- 数据库备份策略
- 访问日志记录

---

## 可扩展性考虑

### 1. 数据库扩展
```
当前：单 PostgreSQL 实例
优化方向：
- 读写分离（主从复制）
- 缓存层（Redis）
- 全文搜索索引（Elasticsearch）
```

### 2. 应用扩展
```
当前：单服务器
优化方向：
- 负载均衡 (Nginx/HAProxy)
- 消息队列 (RabbitMQ/Kafka)
- 任务调度 (Bull/BullMQ)
- 实时通信 (WebSocket)
```

### 3. 前端扩展
```
当前：单页应用 (SPA)
优化方向：
- 代码分割和懒加载
- 状态持久化
- 离线支持 (Service Worker)
- 端到端 (E2E) 测试
```

---

## 性能优化策略

### 1. 数据库查询优化
```typescript
// ❌ N+1 问题
const projects = await Project.findMany();
projects.map(p => Customer.findUnique(p.customerId));

// ✅ 关联加载
const projects = await Project.findMany({
  include: { customer: true }
});
```

### 2. API 响应优化
```typescript
// ❌ 返回全部数据
const allProjects = await Project.findMany();

// ✅ 分页加载
const projects = await Project.findMany({
  skip: (page - 1) * limit,
  take: limit
});
```

### 3. 前端缓存
```typescript
// ✅ Redux 缓存状态
const projects = useSelector(state => state.projects);

// ✅ 本地存储敏感数据
localStorage.setItem('user', JSON.stringify(user));
```

---

## 部署架构

### 开发环境
```
本地计算机
├── Frontend (localhost:5173)
├── Backend (localhost:4000)
└── PostgreSQL (localhost:5432)
```

### 生产环境（Docker Compose）
```
Docker Host
├── Nginx (端口 80/443)
│   └── 静态文件 + API 代理
├── Express Backend (内部)
│   └── API 服务
└── PostgreSQL (内部)
    └── 数据持久化
```

### 企业级部署（Kubernetes）
```
Kubernetes Cluster
├── Ingress (入口控制)
├── Frontend Service
│   └── Multiple Nginx Pods
├── Backend Service
│   └── Multiple Node.js Pods
└── Database Service
    └── PostgreSQL StatefulSet
```

---

## 监控和日志

### 后端日志
```typescript
// 使用 winston 或类似库
logger.info('用户登录成功', { userId });
logger.error('数据库连接失败', { error });
```

### 前端监控
```typescript
// 关键事件追踪
analytics.track('project_created', { priority, quadrant });
// 性能监控
performance.mark('api_call_start');
```

---

## 技术栈总结

| 层级 | 技术 | 版本 |
|-----|------|------|
| 前端框架 | React | 18.2 |
| 状态管理 | Redux Toolkit | 1.9 |
| UI 组件 | Ant Design | 5.11 |
| 前端路由 | React Router | 6.20 |
| API 客户端 | Axios | 1.6 |
| 后端框架 | Express.js | 4.18 |
| 数据库 ORM | Prisma | 5.7 |
| 数据库 | PostgreSQL | 14+ |
| 认证 | JWT | RS256 |
| 部署 | Docker | 最新 |

---

**最后更新：** 2026-01-31
