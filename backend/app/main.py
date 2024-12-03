from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.db.database import engine, Base
from app.api.endpoints import admin

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建上传目录
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

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
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "ok"} 