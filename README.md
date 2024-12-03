# ThreeDisplay

个人3D模型展示系统，包含前后端完整实现。

## 主要特点

- 单一管理员系统
- 支持3D模型在线上传、展示、编辑
- 基于FastAPI（后端）和React（前端）实现
- 支持SQLite和PostgreSQL
- Docker快速部署支持

## 快速开始

### 使用Docker部署（推荐）

1. 安装依赖：
   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker Compose](https://docs.docker.com/compose/install/)

2. 配置环境变量：
   ```bash
   # 复制示例配置文件
   cp backend/.env.example backend/.env
   
   # 编辑配置文件，设置管理员密码和其他选项
   vim backend/.env
   ```

3. 启动服务：
   ```bash
   # 使用默认配置启动（SQLite）
   docker-compose up -d

   # 或者指定管理员密码启动
   ADMIN_PASSWORD=your-secure-password docker-compose up -d

   # 使用PostgreSQL启动
   DB_TYPE=postgresql docker-compose up -d
   ```

### 本地配置部署

1. 后端设置：
   ```bash
   # 进入后端目录
   cd backend

   # 创建虚拟环境
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 或
   .\venv\Scripts\activate  # Windows

   # 安装依赖
   pip install -r requirements.txt

   # 配置环境变量
   cp .env.example .env
   # 编辑 .env 文件设置配置项

   # 启动后端服务
   uvicorn main:app --reload
   ```

2. 前端设置：
   ```bash
   # 进入前端目录
   cd frontend

   # 安装依赖
   npm install

   # 启动开发服务器
   npm run dev
   ```

## 配置说明

### 数据库选择

系统支持两种数据库：

1. SQLite（默认）
   - 轻量级，无需额外配置
   - 适合小型部署和开发环境
   - 数据存储在本地文件中

2. PostgreSQL
   - 功能完整的关系型数据库
   - 适合生产环境和大规模部署
   - 需要额外配置数据库连接信息
   - 默认端口：5433（避免与本地PostgreSQL冲突）

#### 使用 SQLite（默认）

无需特殊配置，确保 `DB_TYPE=sqlite` 即可。数据库文件会自动创建在 `backend/app.db`。

#### 切换到 PostgreSQL

1. 编辑 docker-compose.yml，取消注释 PostgreSQL 服务相关配置

2. 修改环境变量：
   ```ini
   DB_TYPE=postgresql
   POSTGRES_SERVER=db  # 使用Docker时使用服务名
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=threedisplay
   POSTGRES_PORT=5433  # 注意：使用5433端口
   ```

3. 启动服务：
   ```bash
   DB_TYPE=postgresql docker-compose up -d
   ```

4. 访问数据库（如需要）：
   ```bash
   # 本地访问
   psql -h localhost -p 5433 -U postgres -d threedisplay
   ```

### 环境变量

在 `backend/.env` 文件中可以配置以下选项：

```ini
# 基本配置
PROJECT_NAME=ThreeDisplay
VERSION=1.0.0
API_V1_STR=/api/v1

# 安全配置
SECRET_KEY=your-secret-key-keep-it-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 管理员配置
ADMIN_DEFAULT_PASSWORD=admin123  # 应该在生产环境中修改为强密码

# 数据库配置
DB_TYPE=sqlite  # 可选: sqlite 或 postgresql

# SQLite配置（默认）
SQLITE_URL=sqlite:///./app.db

# PostgreSQL配置
#POSTGRES_SERVER=db
#POSTGRES_USER=postgres
#POSTGRES_PASSWORD=postgres
#POSTGRES_DB=threedisplay
#POSTGRES_PORT=5433  # 注意：使用5433端口

# 文件上传配置
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=104857600
ALLOWED_EXTENSIONS=glb,gltf,obj,fbx,jpg,jpeg,png

# CORS配置
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:8000
```

### 文件存储

- 上传的文件存储在 `backend/uploads` 目录
- 数据库文件位于 `backend/app.db`（使用 SQLite 时）
- 这些目录已配置为Docker卷，数据会持久化保存

## 云端部署

1. 修改配置：
   - 使用强密码
   - 更改 SECRET_KEY
   - 配置 CORS 设置
   - 配置 HTTPS

2. 启动服务：
   ```bash
   # 设置环境变量
   export ADMIN_PASSWORD=your-secure-password
   export SECRET_KEY=your-secret-key

   # 启动服务
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 开发指南

### 项目结构

```
.
├── backend/                # 后端目录
│   ├── app/               # 应用代码
│   │   ├── api/          # API路由
│   │   ├── core/         # 核心配置
│   │   ├── crud/         # 数据库操作
│   │   ├── models/       # 数据模型
│   │   └── schemas/      # 数据模式
│   ├── uploads/          # 上传文件目录
│   └── requirements.txt  # Python依赖
│
└── frontend/             # 前端目录
    ├── src/             # 源代码
    │   ├── components/  # 组件
    │   ├── contexts/    # 上下文
    │   ├── pages/       # 页面
    │   └── services/    # 服务
    └── package.json     # NPM配置
```

### API文档

启动后端服务后，可以访问以下地址查看API文档：
- Swagger UI: http://your-ip:8000/docs
- ReDoc: http://your-ip:8000/redoc

## 常见问题

1. 忘记管理员密码？
   - 删除 `backend/app.db` 文件
   - 重新启动服务，系统会使用配置的默认密码创建新管理员

2. 文件上传失败？
   - 检查文件大小是否超过限制
   - 确认文件类型是否在允许列表中
   - 检查上传目录权限

3. 无法连接到后端？
   - 确认服务是否正在运行
   - 检查端口是否被占用
   - 验证CORS配置是否正确


## 主要使用的库

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [React DnD](https://docs.dndkit.com/)

## 许可证

[MIT License](LICENSE) 