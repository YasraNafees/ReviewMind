import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import setting


logger=logging.getLogger("DB")
engine=create_engine(
    setting.DataBase_URL,
    
    connect_args={"sslmode":"require"},
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

SessionLocal=sessionmaker(autocommit=False, autoflush=False , bind=engine)
Base=declarative_base()

def get_db():
    logger.info("DB Session is created")
    db=SessionLocal()
    try:
        yield db 
    finally:
        db.close
        logger.info("Database Session is closed")

print("session is closed")