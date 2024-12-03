from typing import List
from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    # 基本配置
    PROJECT_NAME: str = "ThreeDisplay"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # 安全配置
    SECRET_KEY: str = "your-secret-key-keep-it-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 管理员配置
    ADMIN_DEFAULT_PASSWORD: str = "admin"
    
    # 数据库配置
    DB_TYPE: str = "sqlite"  # 可选: "sqlite" 或 "postgresql"
    SQLITE_URL: str = "sqlite:///./app.db"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "threedisplay"
    POSTGRES_PORT: str = "5433"
    
    # 文件上传配置
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS: str = "glb,gltf,obj,fbx,jpg,jpeg,png"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://localhost:8000"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

    @property
    def DATABASE_URL(self) -> str:
        """获取数据库URL"""
        if self.DB_TYPE == "postgresql":
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        return self.SQLITE_URL

    @property
    def allowed_extensions_set(self) -> set[str]:
        """获取允许的文件扩展名集合"""
        return set(ext.strip() for ext in self.ALLOWED_EXTENSIONS.split(","))
    
    @property
    def cors_origins(self) -> List[str]:
        """获取CORS源列表"""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]

# 创建全局设置对象
settings = Settings()

# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 