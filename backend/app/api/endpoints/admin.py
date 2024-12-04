from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body, status
from sqlalchemy.orm import Session
import os
import shutil
import logging

from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud.admin import admin
from app.schemas.token import Token
from app.schemas.admin import Admin, AdminUpdate, PasswordUpdate

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    password: str = Body(..., embed=True),
    db: Session = Depends(deps.get_db),
) -> Any:
    """管理员登录"""
    try:
        logger.info("Login attempt received")
        
        # 确保管理员账号存在
        admin.ensure_admin_exists(db)
        
        # 验证密码
        current_admin = admin.authenticate(db, password=password)
        if not current_admin:
            logger.warning("Authentication failed: incorrect password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="密码错误，请重试"
            )
        
        # 生成token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = {
            "access_token": security.create_access_token(
                current_admin.id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
        logger.info("Login successful")
        return token
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="服务器错误，请稍后重试"
        )

@router.get("/me", response_model=Admin)
def read_admin_me(
    current_admin = Depends(deps.get_current_admin),
) -> Any:
    """获取当前管理员信息"""
    return current_admin

@router.put("/me", response_model=Admin)
def update_admin_me(
    *,
    db: Session = Depends(deps.get_db),
    admin_in: AdminUpdate,
    current_admin = Depends(deps.get_current_admin),
) -> Any:
    """更新管理员信息"""
    updated_admin = admin.update(db, db_obj=current_admin, obj_in=admin_in)
    return updated_admin

@router.post("/me/password", response_model=Admin)
def update_admin_password(
    *,
    db: Session = Depends(deps.get_db),
    password_data: PasswordUpdate,
    current_admin = Depends(deps.get_current_admin),
) -> Any:
    """更新管理员密码"""
    # 验证旧密码
    if not security.verify_password(password_data.old_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="当前密码错误"
        )
    
    # 更新密码
    updated_admin = admin.update(
        db,
        db_obj=current_admin,
        obj_in=AdminUpdate(password=password_data.new_password)
    )
    return updated_admin

@router.post("/me/avatar", response_model=Admin)
async def update_admin_avatar(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_admin = Depends(deps.get_current_admin),
) -> Any:
    """更新管理员头像"""
    # 创建上传目录
    avatar_dir = os.path.join(settings.UPLOAD_DIR, "avatars")
    os.makedirs(avatar_dir, exist_ok=True)
    
    # 保存文件
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"admin_avatar{file_extension}"
    file_path = os.path.join(avatar_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 更新数据库
    relative_path = os.path.join("avatars", file_name)
    updated_admin = admin.update_avatar(db, db_obj=current_admin, avatar_path=relative_path)
    return updated_admin

@router.post("/initialize", response_model=Admin)
def initialize_admin(
    db: Session = Depends(deps.get_db),
) -> Any:
    """初始化管理员账号（如果不存在）"""
    try:
        current_admin = admin.ensure_admin_exists(db)
        return current_admin
    except Exception as e:
        logger.error(f"Failed to initialize admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="初始化管理员账号失败"
        )