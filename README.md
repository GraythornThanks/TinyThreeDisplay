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
- JWT认证
- Pydantic数据验证

### 前端
- TypeScript
- React 18
- Material-UI (MUI)
- Three.js
- React Three Fiber
- Vite

### 部署
- Docker
- Docker Compose
- Nginx

## 部署说明

1. （可选）配置 Docker 国内镜像：

   如果您在中国大陆地区，建议配置 Docker 国内镜像以加快构建速度。

   Windows（在 `%userprofile%/.docker/daemon.json`）或 Linux（在 `/etc/docker/daemon.json`）中添加：
   ```json
   {
     "registry-mirrors": [
       "https://mirror.ccs.tencentyun.com",
       "https://registry.docker-cn.com",
       "https://docker.mirrors.ustc.edu.cn",
       "https://dockerhub.azk8s.cn"
     ]
   }
   ```

   然后重启 Docker 服务：
   ```bash
   # Windows
   net stop docker && net start docker

   # Linux
   sudo systemctl restart docker
   ```

2. 配置环境变量：
   ```bash
   # 复制环境变量配置文件
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

   根据需要修改配置文件中的值：
   - 根目录 `.env`：包含 Docker Compose 使用的基本配置
   - `backend/.env`：包含后端服务的详细配置

3. 构建和启动服务：
   ```bash
   # 构建并启动所有服务
   docker-compose up -d --build
   ```

4. 验证服务状态：
   ```bash
   # 检查服务状态
   docker-compose ps

   # 查看服务日志
   docker-compose logs -f
   ```

5. 访问服务：
   - 前端界面：http://localhost
   - 后端API：http://localhost:8000
   - API文档：http://localhost:8000/docs

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

# 服务端口配置
BACKEND_PORT=8000
FRONTEND_PORT=80

# 包镜像配置（可选，中国大陆用户建议设置为 true）
USE_CHINA_MIRRORS=false
NPM_MIRROR=https://registry.npmmirror.com
PYPI_MIRROR=https://mirrors.aliyun.com/pypi/simple

# Docker 构建配置（可选，中国大陆用户可能需要）
DOCKER_BUILD_NETWORK=default
COMPOSE_DOCKER_CLI_BUILD=1
DOCKER_BUILDKIT=1
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
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:80

# 更多配置请参考 backend/.env.example
```

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 