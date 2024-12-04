from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.models.admin import Admin
from app.crud.admin import admin

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/admin/login"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_admin(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> Admin:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        admin_id: int = int(payload["sub"])
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    current_admin = admin.get_admin(db)
    if not current_admin or current_admin.id != admin_id:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    return current_admin 