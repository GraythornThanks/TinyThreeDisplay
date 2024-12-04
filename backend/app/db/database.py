from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# 创建数据库引擎，添加连接池配置和重试机制
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
    connect_args={
        "connect_timeout": 10
    }
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        # 测试连接是否有效
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise
    finally:
        db.close()

# 初始化数据库连接
def init_db():
    retries = 5
    retry_interval = 5

    for i in range(retries):
        try:
            # 测试数据库连接
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                conn.commit()
            logger.info("Database connection successful")
            return
        except Exception as e:
            if i < retries - 1:
                logger.warning(f"Database connection attempt {i + 1} failed: {str(e)}")
                logger.info(f"Retrying in {retry_interval} seconds...")
                time.sleep(retry_interval)
            else:
                logger.error("All database connection attempts failed")
                raise 