from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.core.config import settings
from app.db.database import engine, Base, init_db
from app.api.endpoints import admin

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 导入所有模型以确保它们被注册
from app.models.admin import Admin  # 确保Admin模型被导入
from app.models.base import BaseModel  # 导入基础模型

# 初始化数据库连接并创建表
logger.info(f"Database URL: {settings.DATABASE_URL}")
try:
    # 首先尝试建立数据库连接
    init_db()
    # 然后创建表
    Base.metadata.create_all(bind=engine)
    logger.info("Successfully created database tables")
except Exception as e:
    logger.error(f"Error initializing database: {str(e)}")
    raise

# 创建上传目录
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "avatars"), exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置静态文件服务
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# 包含路由
app.include_router(admin.router, prefix=settings.API_V1_STR + "/admin", tags=["admin"])

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "ok"} 