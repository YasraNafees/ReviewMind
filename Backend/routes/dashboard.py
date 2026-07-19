from fastapi import APIRouter, Depends
from sqlalchemy import func, text
from database import get_db
from models import Review
from logger import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.get("/health")
def check_db_health(db=Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        logger.info("Database health check successful")
        return {"status": "Healthy", "database": "Connected"}

    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "Unhealthy", "error": str(e)}


@router.get("/get-dashboard-data/")
def get_dashboard_data(db=Depends(get_db)):
    try:
        positive = db.query(Review).filter(Review.sentiment_label == "Positive").count()
        negative = db.query(Review).filter(Review.sentiment_label == "Negative").count()
        neutral = db.query(Review).filter(Review.sentiment_label == "Neutral").count()

        cluster_counts = db.query(
            Review.cluster_id,
            func.count(Review.id)
        ).filter(
            Review.cluster_id.isnot(None)
        ).group_by(
            Review.cluster_id
        ).all()

        clusters_list = [
            {"name": f"Group {c[0]}", "complaints": c[1]}
            for c in cluster_counts
        ]

        logger.info("Dashboard data fetched successfully")

        return {
            "sentiments": {
                "Positive": positive,
                "Negative": negative,
                "Neutral": neutral
            },
            "clusters": clusters_list
        }

    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        return {"error": str(e)}