# ThreeDisplay

ThreeDisplay 是一个用于3D模型展示和管理的Web应用系统。

## 技术栈

### 前端
- React + TypeScript
- Material-UI (MUI)
- Three.js
- Vite

### 后端
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python 3.11

### 部署
- Docker
- Nginx
- Uvicorn

## 功能特性

- 管理员账户系统
  - 密码登录
  - 个人资料管理
  - 头像上传

- 3D模型管理（开发中）
  - 模型上传
  - 模型预览
  - 模型列表
  - 模型编辑

## 部署指南

### 环境要求

- Docker
- Docker Compose

### 部署步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/threedisplay.git
cd threedisplay
```

2. 配置环境变量
```bash
cp backend/.env.example backend/.env
```
编辑 `.env` 文件，设置必要的环境变量：
- `SECRET_KEY`: 用于JWT加密的密钥
- `ADMIN_DEFAULT_PASSWORD`: 管理员初始密码
- `POSTGRES_*`: 数据库配置

3. 创建必要的目录
```bash
mkdir -p backend/uploads/avatars
chmod -R 755 backend/uploads
```

4. 启动服务
```bash
docker-compose up --build -d
```

5. 访问服务
- 前端界面：http://localhost
- 后端API文档：http://localhost:8000/docs
- 管理员登录：http://localhost/admin/login

### 目录结构

```
threedisplay/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── uploads/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

### 配置说明

#### 环境变量

- `PROJECT_NAME`: 项目名称
- `VERSION`: 版本号
- `API_V1_STR`: API前缀
- `SECRET_KEY`: JWT密钥
- `ALGORITHM`: JWT算法
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token过期时间
- `ADMIN_DEFAULT_PASSWORD`: 管理员初始密码
- `POSTGRES_*`: 数据库配置
- `UPLOAD_DIR`: 上传目录
- `MAX_UPLOAD_SIZE`: 最大上传大小
- `ALLOWED_EXTENSIONS`: 允许的文件扩展名
- `BACKEND_CORS_ORIGINS`: CORS配置

#### 数据库

PostgreSQL数据库配置：
- 端口: 5433（外部访问）
- 用户名: 通过环境变量配置
- 密码: 通过环境变量配置
- 数据库名: 通过环境变量配置

#### Nginx

前端服务器配置：
- 端口: 80
- 静态文件目录: /usr/share/nginx/html
- API代理: /api/v1 -> backend:8000

## 开发指南

### 前端开发

1. 安装依赖
```bash
cd frontend
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

### 后端开发

1. 创建虚拟环境
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 启动开发服务器
```bash
uvicorn main:app --reload
```

## 维护说明

### 日志

- 前端日志：容器日志
- 后端日志：容器日志
- 数据库日志：PostgreSQL日志

### 备份

建议定期备份以下内容：
- PostgreSQL数据库
- uploads目录（用户上传的文件）

### 更新

1. 拉取最新代码
```bash
git pull
```

2. 重新构建并启动服务
```bash
docker-compose up --build -d
```

## 许可证

[MIT License](LICENSE) 