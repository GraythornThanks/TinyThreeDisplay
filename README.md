# ThreeDisplay

ThreeDisplay 是一个用于管理和展示3D模型的Web应用。它提供了模型上传、预览、管理等功能，支持多种3D文件格式。

## 功能特性

- 支持多种3D模型格式（glb, gltf, obj, fbx, stl）
- 模型在线预览和交互
- 模型管理（上传、编辑、删除）
- 管理员账户系统
- 响应式设计，支持移动端访问

## 技术栈

### 后端
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic（数据库迁移）
- JWT认证
- Pydantic数据验证

### 前端
- TypeScript
- React 18
- Material-UI (MUI)
- Three.js
- React Three Fiber
- Vite
- React Router
- Axios

### 部署
- Docker
- Docker Compose
- Nginx

## 开发环境设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/threedisplay.git
   cd threedisplay
   ```

2. 配置环境变量：
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
   根据需要修改配置文件中的值。

3. 启动开发环境：
   ```bash
   # 使用开发配置启动
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

   # 或使用生产配置启动
   docker-compose up -d
   ```

4. 访问应用：
   - 前端开发服务器：http://localhost:5173
   - 前端生产服务：http://localhost:3000
   - 后端API：http://localhost:8000
   - API文档：http://localhost:8000/docs

## 配置说明

### 根目录 .env

```env
# 基本配置
COMPOSE_PROJECT_NAME=threedisplay

# 数据库配置
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=threedisplay
POSTGRES_PORT=5432

# 后端配置
BACKEND_PORT=8000
BACKEND_RELOAD=true
BACKEND_WORKERS=1
BACKEND_LOG_LEVEL=info

# 前端配置
FRONTEND_PORT=3000
FRONTEND_DEV_PORT=5173
VITE_API_URL=http://localhost:8000/api/v1

# 包镜像配置（可选）
USE_CHINA_MIRRORS=false
NPM_MIRROR=https://registry.npmmirror.com
PYPI_MIRROR=https://mirrors.aliyun.com/pypi/simple
```

### 后端 backend/.env

```env
# 基本配置
PROJECT_NAME=ThreeDisplay
VERSION=1.0.0
API_V1_STR=/api/v1

# 安全配置
SECRET_KEY=your-secret-key-keep-it-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 管理员配置
ADMIN_DEFAULT_PASSWORD=admin123  # 生产环境中应修改为强密码

# 文件上传配置
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=104857600  # 100MB
ALLOWED_EXTENSIONS=glb,gltf,obj,fbx,stl

# 更多配置请参考 backend/.env.example
```

## 目录结构

```
threedisplay/
├── backend/                # 后端代码
│   ├── app/               # 应用代码
│   │   ├── api/          # API路由
│   │   ├── core/         # 核心功能
│   │   ├── crud/         # CRUD操作
│   │   ├── db/           # 数据库配置
│   │   ├── models/       # 数据库模型
│   │   └── schemas/      # Pydantic模式
│   ├── uploads/          # 上传文件存储
│   └── tests/            # 测试代码
├── frontend/             # 前端代码
│   ├── public/          # 静态资源
│   └── src/             # 源代码
│       ├── components/  # React组件
│       ├── contexts/    # React上下文
│       ├── hooks/       # 自定义Hooks
│       ├── pages/       # 页面组件
│       ├── services/    # API服务
│       └── types/       # TypeScript类型
└── docker/              # Docker配置
```

## API文档

启动后端服务后，可以通过以下地址访问API文档：
- Swagger UI：http://localhost:8000/docs
- ReDoc：http://localhost:8000/redoc

## 部署

1. 配置环境变量：
   ```bash
   # 复制环境变量配置文件
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

   根据需要修改配置文件中的值：
   - 根目录 `.env`：包含 Docker Compose 使用的基本配置
   - `backend/.env`：包含后端服务的详细配置

2. 构建和启动服务：
   ```bash
   # 构建并启动所有服务
   docker-compose up -d --build

   # 或仅启动服务（如果已经构建）
   docker-compose up -d
   ```

3. 验证服务状态：
   ```bash
   # 检查服务状态
   docker-compose ps

   # 查看服务日志
   docker-compose logs -f
   ```

4. 访问服务：
   - 前端界面：http://localhost
   - 后端API：http://localhost:8000
   - API文档：http://localhost:8000/docs
   - 数据库（仅开发环境）：localhost:5433

## 环境变量配置说明

### 根目录 .env

用于 Docker Compose 的基本配置：

```env
# 基本配置
COMPOSE_PROJECT_NAME=threedisplay

# 数据库配置
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=threedisplay
POSTGRES_PORT=5432

# 包镜像配置（可选）
USE_CHINA_MIRRORS=false
NPM_MIRROR=https://registry.npmmirror.com
PYPI_MIRROR=https://mirrors.aliyun.com/pypi/simple
```

### 后端 backend/.env

后端服务的详细配置：

```env
# 基本配置
PROJECT_NAME=ThreeDisplay
VERSION=1.0.0
API_V1_STR=/api/v1

# 安全配置
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 管理员配置
ADMIN_DEFAULT_PASSWORD=admin123  # 生产环境中应修改为强密码

# 文件上传配置
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=104857600  # 100MB
ALLOWED_EXTENSIONS=glb,gltf,obj,fbx,stl

# CORS配置
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:80,http://localhost:3000,http://localhost:5173

# 更多配置请参考 backend/.env.example
```

## 开发环境配置

如果需要在开发环境中运行：

1. 使用开发配置：
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

2. 开发环境特点：
   - 前端热重载：http://localhost:5173
   - 后端自动重载
   - 源代码目录挂载
   - 更详细的日志输出

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 