import hashlib
import logging
from sqlalchemy import Column,Integer, Float,Date,String
from pgvector.sqlalchemy import Vector
from database import Base

logger=logging.getLogger("ReviewSystem")
logger.info("Loading Review model")
class Review(Base):
    __tablename__="reviews"
    id = Column(Integer, primary_key=True, index=True)
    raw_text = Column(String, nullable=False)
    clean_text = Column(String, nullable=True)
    score = Column(Integer, nullable=True)
    review_date = Column(Date, nullable=True)
    sentiment_label = Column(String, nullable=True)
    sentiment_score = Column(Float, nullable=True)
    cluster_id = Column(Integer, nullable=True)
    embedding = Column(Vector(1536), nullable=True)

logger.info("Review model loaded successfully")

