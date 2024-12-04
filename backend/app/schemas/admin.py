from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AdminBase(BaseModel):
    nickname: Optional[str] = None
    bio: Optional[str] = None

class AdminCreate(BaseModel):
    password: str

class AdminUpdate(AdminBase):
    password: Optional[str] = None

class PasswordUpdate(BaseModel):
    old_password: str = Field(..., description="当前密码")
    new_password: str = Field(..., min_length=6, description="新密码")

class Admin(AdminBase):
    id: int
    avatar_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AdminInDB(Admin):
    hashed_password: str 