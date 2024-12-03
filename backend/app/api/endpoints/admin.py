from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
import shutil

from app.api import deps
from app.core import security
from app.core.config import settings
import app.crud.admin as crud
from app.schemas.token import Token
from app.schemas.admin import Admin, AdminUpdate

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """管理员登录"""
    # 确保管理员账号存在
    crud.ensure_admin_exists(db)
    
    admin = crud.authenticate(db, password=form_data.password)
    if not admin:
        raise HTTPException(status_code=400, detail="密码错误")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            admin.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

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
    admin = crud.update_admin(db, db_obj=current_admin, obj_in=admin_in)
    return admin

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
    admin = crud.update_avatar(db, db_obj=current_admin, avatar_path=relative_path)
    return admin 