# API 文档

## 基本信息

**基础 URL：** `http://localhost:4000/api`  
**认证方式：** JWT Bearer Token  
**响应格式：** JSON

## 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

错误响应：
```json
{
  "success": false,
  "error": "错误信息",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

## 认证 API

### 用户注册

**请求**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "fullName": "User Name"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "fullName": "User Name",
      "role": "STAFF",
      "isActive": true
    }
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 用户登录

**请求**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**
同注册响应

### 获取当前用户

**请求**
```http
GET /auth/me
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "fullName": "User Name",
    "role": "STAFF",
    "department": "技术部",
    "avatar": "https://...",
    "phone": "13800138000",
    "isActive": true,
    "createdAt": "2026-01-30T00:00:00.000Z",
    "updatedAt": "2026-01-31T00:00:00.000Z"
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 更新个人资料

**请求**
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "New Name",
  "phone": "13800138000",
  "avatar": "https://avatar.url",
  "department": "销售部"
}
```

**响应**
返回更新后的用户信息

### 修改密码

**请求**
```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**响应**
```json
{
  "success": true,
  "message": "密码已更改",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

## 客户 API

### 创建客户

**请求**
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "company": "某某公司",
  "level": "A",
  "tags": ["重要", "合作中"],
  "notes": "备注信息"
}
```

**参数说明**
- `level`: 客户等级 (S, A, B, C)

### 获取客户列表

**请求**
```http
GET /customers?page=1&limit=20
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "customer-id",
        "name": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "company": "某某公司",
        "level": "A",
        "status": "SUPPORTING",
        "tags": ["重要", "合作中"],
        "projects": [
          {
            "id": "project-id",
            "title": "项目名称",
            "status": "IN_PROGRESS"
          }
        ],
        "createdAt": "2026-01-30T00:00:00.000Z",
        "updatedAt": "2026-01-31T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 搜索客户

**请求**
```http
GET /customers/search?keyword=张三&level=A&status=SUPPORTING&page=1&limit=20
Authorization: Bearer <token>
```

**查询参数**
- `keyword`: 搜索关键词（名称、邮箱、电话、公司）
- `level`: 客户等级 (S, A, B, C)
- `status`: 客户状态 (PROSPECT, SUPPORTING, MAINTENANCE, COMPLETED, ARCHIVED)
- `tags`: 标签数组
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）

### 获取客户详情

**请求**
```http
GET /customers/:id
Authorization: Bearer <token>
```

### 更新客户

**请求**
```http
PUT /customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新名称",
  "email": "new@example.com",
  "level": "S",
  "status": "MAINTENANCE"
}
```

### 删除客户

**请求**
```http
DELETE /customers/:id
Authorization: Bearer <token>
```

### 获取客户统计

**请求**
```http
GET /customers/stats
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "byLevel": {
      "S": 10,
      "A": 25,
      "B": 40,
      "C": 25
    },
    "byStatus": {
      "PROSPECT": 20,
      "SUPPORTING": 50,
      "MAINTENANCE": 20,
      "COMPLETED": 8,
      "ARCHIVED": 2
    }
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

## 项目 API

### 创建项目

**请求**
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "项目名称",
  "description": "项目描述",
  "customerId": "customer-id",
  "assignedToId": "user-id",
  "priority": "HIGH",
  "quadrant": "IMPORTANT_URGENT",
  "dueDate": "2026-02-28",
  "estimatedHours": 40,
  "tags": ["开发", "紧急"]
}
```

### 搜索项目

**请求**
```http
GET /projects/search?keyword=项目&status=IN_PROGRESS&priority=HIGH&page=1&limit=20
Authorization: Bearer <token>
```

**查询参数**
- `keyword`: 搜索关键词（项目名称、描述）
- `status`: 项目状态
- `priority`: 优先级 (LOW, MEDIUM, HIGH, URGENT)
- `quadrant`: 象限
- `assignedToId`: 分配人 ID
- `customerId`: 客户 ID
- `dueDateFrom`, `dueDateTo`: 截止日期范围
- `page`: 页码
- `limit`: 每页数量

### 获取四象限数据

**请求**
```http
GET /projects/quadrant?userId=user-id
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "IMPORTANT_URGENT": [
      {
        "id": "project-id",
        "title": "紧急项目",
        "priority": "URGENT",
        "status": "IN_PROGRESS",
        "dueDate": "2026-02-01"
      }
    ],
    "IMPORTANT_NOT_URGENT": [],
    "NOT_IMPORTANT_URGENT": [],
    "NOT_IMPORTANT_NOT_URGENT": []
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 更新项目状态

**请求**
```http
PATCH /projects/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

### 更新项目象限

**请求**
```http
PATCH /projects/:id/quadrant
Authorization: Bearer <token>
Content-Type: application/json

{
  "quadrant": "IMPORTANT_NOT_URGENT"
}
```

### 获取项目统计

**请求**
```http
GET /projects/stats?userId=user-id
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "BACKLOG": 5,
      "TODO": 10,
      "IN_PROGRESS": 20,
      "REVIEW": 10,
      "COMPLETED": 4,
      "BLOCKED": 1,
      "CANCELLED": 0
    },
    "byPriority": {
      "LOW": 10,
      "MEDIUM": 20,
      "HIGH": 15,
      "URGENT": 5
    },
    "overdue": 2,
    "dueSoon": 8
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

## 工作日志 API

### 创建工作日志

**请求**
```http
POST /work-logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project-id",
  "title": "完成某个功能",
  "description": "详细说明",
  "workType": "DEVELOPMENT",
  "duration": 480,
  "spentDate": "2026-01-31",
  "tags": ["后端", "API开发"]
}
```

**参数说明**
- `duration`: 分钟数（480 = 8小时）
- `workType`: 工作类型 (DEVELOPMENT, TESTING, DOCUMENTATION, MEETING, SUPPORT, DEBUGGING, REVIEW, OTHER)

### 获取项目的工作日志

**请求**
```http
GET /work-logs/project/:projectId?page=1&limit=20
Authorization: Bearer <token>
```

### 获取用户的工作日志

**请求**
```http
GET /work-logs/user/:userId?page=1&limit=20
Authorization: Bearer <token>
```

### 获取日期范围内的工作日志

**请求**
```http
GET /work-logs/date-range?dateFrom=2026-01-01&dateTo=2026-01-31&userId=user-id
Authorization: Bearer <token>
```

### 获取工作日志统计

**请求**
```http
GET /work-logs/stats?userId=user-id
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "totalLogs": 50,
    "totalHours": 160.5,
    "totalMinutes": 9630,
    "byType": [
      {
        "type": "DEVELOPMENT",
        "count": 30,
        "hours": 120.5
      },
      {
        "type": "TESTING",
        "count": 15,
        "hours": 30
      }
    ]
  },
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 更新工作日志

**请求**
```http
PUT /work-logs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新标题",
  "duration": 500,
  "workType": "TESTING"
}
```

### 删除工作日志

**请求**
```http
DELETE /work-logs/:id
Authorization: Bearer <token>
```

## 错误响应

### 401 Unauthorized
```json
{
  "success": false,
  "error": "缺少认证令牌",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "权限不足",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "资源不存在",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "请求参数错误",
  "timestamp": "2026-01-31T10:00:00.000Z"
}
```

---

**最后更新：** 2026-01-31
