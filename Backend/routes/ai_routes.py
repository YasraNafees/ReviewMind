from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from logger import get_logger

from services import (
    sentiment_service,
    embedding_service,
    clustering_service,
    summary_service,
    chat_service
)


router = APIRouter()

logger = get_logger(__name__)


@router.post("/process-sentiment/")
def process_sentiment(db=Depends(get_db)):
    try:
        logger.info("Sentiment processing started")

        result = sentiment_service.process_sentiments(db)

        logger.info("Sentiment processing completed")

        return result

    except Exception as e:
        db.rollback()

        logger.error(
            f"Sentiment route error: {str(e)}"
        )

        return {
            "error": str(e)
        }



@router.post("/generating-embeddings/")
def generating_embeddings(db=Depends(get_db)):
    try:
        logger.info("Embedding generation started")

        result = embedding_service.generate_embeddings(db)

        logger.info("Embedding generation completed")

        return result

    except Exception as e:
        db.rollback()

        logger.error(
            f"Embedding route error: {str(e)}"
        )

        return {
            "error": str(e)
        }



@router.post("/cluster-reviews/")
def cluster_reviews(db=Depends(get_db)):
    try:
        logger.info("Clustering process started")

        result = clustering_service.cluster_review(db)

        logger.info("Clustering process completed")

        return result

    except Exception as e:
        db.rollback()

        logger.error(
            f"Clustering route error: {str(e)}"
        )

        return {
            "error": str(e)
        }



@router.post("/generate-summary/")
def generate_summary(db=Depends(get_db)):
    try:
        logger.info("Summary generation started")

        result = summary_service.generate_summary(db)

        logger.info("Summary generation completed")

        return result

    except Exception as e:
        db.rollback()

        logger.error(
            f"Summary route error: {str(e)}"
        )

        return {
            "error": str(e)
        }



@router.post("/ask-bot")
def ask_bot(
    question: str,
    db=Depends(get_db)
):
    try:
        logger.info(
            f"Bot question received: {question}"
        )

        result = chat_service.ask_bot(
            question,
            db
        )

        logger.info(
            "Bot response generated"
        )

        return result

    except Exception as e:
        db.rollback()

        logger.error(
            f"Chat route error: {str(e)}"
        )

        return {
            "error": str(e)
        }