# 任务看板项目 (Task Board)

一个简洁美观的任务管理看板应用，使用 Node.js、Vue3 和 MongoDB 构建。

## 项目特点

- 现代化的 UI 设计，渐变背景和卡片式布局
-  三列看板：待办、进行中、已完成
- 拖拽任务，轻松切换状态
-  完整的 CRUD 操作（创建、读取、更新、删除）
- 前后端分离架构
- MongoDB 数据持久化

##  技术栈

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

## 快速开始

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

##  使用说明

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

## 项目结构

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

## API 接口

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
