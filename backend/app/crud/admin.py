from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminUpdate
from app.core.security import get_password_hash, verify_password
from app.core.config import settings

class CRUDAdmin(CRUDBase[Admin, AdminCreate, AdminUpdate]):
    def get_admin(self, db: Session) -> Optional[Admin]:
        """获取管理员（系统中只有一个管理员）"""
        return db.query(Admin).first()

    def create(self, db: Session, *, obj_in: AdminCreate) -> Admin:
        """创建管理员"""
        db_obj = Admin(
            hashed_password=get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Admin, obj_in: AdminUpdate
    ) -> Admin:
        """更新管理员信息"""
        update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def update_avatar(self, db: Session, *, db_obj: Admin, avatar_path: str) -> Admin:
        """更新管理员头像"""
        db_obj.avatar_path = avatar_path
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, password: str) -> Optional[Admin]:
        """验证管理员密码"""
        admin = self.get_admin(db)
        if not admin:
            return None
        if not verify_password(password, admin.hashed_password):
            return None
        return admin

    def ensure_admin_exists(self, db: Session) -> Admin:
        """确保管理员账号存在，如果不存在则创建一个默认账号"""
        admin = self.get_admin(db)
        if not admin:
            admin = self.create(
                db,
                obj_in=AdminCreate(
                    password=settings.INITIAL_ADMIN_PASSWORD
                )
            )
        return admin

admin = CRUDAdmin(Admin)