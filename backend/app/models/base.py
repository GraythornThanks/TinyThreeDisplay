from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class BaseModel(Base):
    """基础模型类，包含所有模型共有的字段"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 