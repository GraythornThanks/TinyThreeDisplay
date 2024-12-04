from typing import List
from pydantic_settings import BaseSettings
import os
from pathlib import Path

# 获取项目根目录
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # 基本配置
    PROJECT_NAME: str = "ThreeDisplay"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # 安全配置
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 管理员配置
    ADMIN_DEFAULT_PASSWORD: str = "admin123"
    
    # 数据库配置
    POSTGRES_SERVER: str = "db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "threedisplay"
    POSTGRES_PORT: int = 5432
    
    # 文件上传配置
    UPLOAD_DIR: str = str(ROOT_DIR / "uploads")
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: str = "stl,obj,fbx,gltf,glb"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # 管理员初始密码
    INITIAL_ADMIN_PASSWORD: str = "admin123"
    
    class Config:
        case_sensitive = True
        env_file = str(ROOT_DIR / ".env")

    @property
    def DATABASE_URL(self) -> str:
        """获取数据库URL"""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def allowed_extensions_set(self) -> set[str]:
        """获取允许的文件扩展名集合"""
        return {ext.strip().lower() for ext in self.ALLOWED_EXTENSIONS.split(",")}
    
    @property
    def cors_origins(self) -> List[str]:
        """获取CORS源列表"""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]

# 创建全局设置对象
settings = Settings()

# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 