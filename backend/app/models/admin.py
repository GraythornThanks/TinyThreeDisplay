from sqlalchemy import Column, String, Text
from app.models.base import BaseModel

class Admin(BaseModel):
    __tablename__ = "admin"

    nickname = Column(String, nullable=True)
    hashed_password = Column(String)
    avatar_path = Column(String, nullable=True)
    bio = Column(Text, nullable=True) 