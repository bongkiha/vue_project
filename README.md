# 任务看板项目 (Task Board)

一个简洁美观的任务管理看板应用，使用 Node.js、Vue3 和 MongoDB 构建。

## 🎯 项目特点

- ✨ 现代化的 UI 设计，渐变背景和卡片式布局
- 🎯 三列看板：待办、进行中、已完成
- 🖱️ 拖拽任务，轻松切换状态
- 📝 完整的 CRUD 操作（创建、读取、更新、删除）
- 🚀 前后端分离架构
- 💾 MongoDB 数据持久化

## 📦 技术栈

### 后端
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS

### 前端
- Vue 3 (Composition API)
- Vite
- Axios
- 原生拖拽 API

## 🚀 快速开始

### 前置要求

- Node.js (v14 或更高版本)
- MongoDB (本地安装或使用 MongoDB Atlas)

### 安装步骤

#### 1. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 2. 安装后端依赖

```bash
cd backend
npm install
```

#### 3. 启动后端服务器

```bash
npm run dev
```

后端将在 `http://localhost:5000` 运行

#### 4. 安装前端依赖

打开新的终端窗口：

```bash
cd frontend
npm install
```

#### 5. 启动前端开发服务器

```bash
npm run dev
```

前端将在 `http://localhost:3000` 运行

## 📖 使用说明

### 创建任务

1. 点击右上角的 "+ 新建任务" 按钮
2. 填写任务标题和描述
3. 选择初始状态（默认为"待办"）
4. 点击"保存"

### 拖拽任务

- 按住任务卡片，拖动到其他列即可改变任务状态
- 状态会自动更新到数据库

### 编辑任务

1. 点击任务卡片上的"编辑"按钮
2. 修改任务信息
3. 点击"保存"

### 删除任务

1. 点击任务卡片上的"删除"按钮
2. 确认删除操作

## 📁 项目结构

```
project/
├── backend/
│   ├── models/
│   │   └── Task.js          # 任务数据模型
│   ├── routes/
│   │   └── tasks.js         # 任务路由
│   ├── server.js            # 后端入口文件
│   └── package.json
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js       # API 调用封装
    │   ├── App.vue          # 主应用组件
    │   ├── main.js          # 前端入口文件
    │   └── style.css        # 全局样式
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔌 API 接口

### 获取所有任务
```
GET /api/tasks
```

### 创建新任务
```
POST /api/tasks
Body: { title, description, status }
```

### 更新任务
```
PUT /api/tasks/:id
Body: { title, description, status }
```

### 删除任务
```
DELETE /api/tasks/:id
```

## 🎨 面试亮点

这个项目展示了以下技术能力：

1. **全栈开发能力**
   - 前后端分离架构
   - RESTful API 设计
   - 数据库设计与操作

2. **Vue 3 核心特性**
   - Composition API
   - 响应式数据管理
   - 组件化开发

3. **用户体验**
   - 拖拽交互
   - 实时数据更新
   - 优雅的 UI 设计

4. **代码质量**
   - 模块化代码结构
   - 清晰的文件组织
   - 易于维护和扩展

## 💡 扩展建议

可以进一步添加的功能：

- 用户认证和授权
- 任务优先级和截止日期
- 任务标签和分类
- 搜索和过滤功能
- 任务统计和图表
- 实时通知
- 团队协作功能

## 📝 开发者备注

这是一个适合实习生的入门级全栈项目，代码简洁易懂，功能完整。在面试中可以重点讲解：

- 项目架构设计思路
- 前后端数据交互流程
- Vue 3 Composition API 的优势
- 拖拽功能的实现原理
- MongoDB 数据模型设计

祝你面试成功！🎉
