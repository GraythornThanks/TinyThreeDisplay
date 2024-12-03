from typing import Optional
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminUpdate
from app.core.config import settings

def get_admin(db: Session) -> Optional[Admin]:
    """获取管理员（系统中只有一个管理员）"""
    return db.query(Admin).first()

def create_admin(db: Session, *, obj_in: AdminCreate) -> Admin:
    """创建管理员（如果不存在）"""
    db_obj = Admin(
        hashed_password=get_password_hash(obj_in.password)
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_admin(
    db: Session,
    *,
    db_obj: Admin,
    obj_in: AdminUpdate
) -> Admin:
    """更新管理员信息"""
    if obj_in.nickname is not None:
        db_obj.nickname = obj_in.nickname
    if obj_in.bio is not None:
        db_obj.bio = obj_in.bio
    if obj_in.password is not None:
        db_obj.hashed_password = get_password_hash(obj_in.password)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_avatar(
    db: Session,
    *,
    db_obj: Admin,
    avatar_path: str
) -> Admin:
    """更新管理员头像"""
    db_obj.avatar_path = avatar_path
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def authenticate(
    db: Session,
    *,
    password: str
) -> Optional[Admin]:
    """验证管理员密码"""
    admin = get_admin(db)
    if not admin:
        return None
    if not verify_password(password, admin.hashed_password):
        return None
    return admin

def ensure_admin_exists(db: Session) -> Admin:
    """确保管理员存在，如果不存在则创建"""
    admin = get_admin(db)
    if not admin:
        admin = create_admin(db, obj_in=AdminCreate(password=settings.ADMIN_DEFAULT_PASSWORD))
    return admin