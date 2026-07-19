from openai import OpenAI
from models import Review
from config import setting
from logger import get_logger

logger = get_logger(__name__)


def generate_embeddings(db):
    try:
        reviews = db.query(Review).filter(Review.embedding == None).all()

        if not reviews:
            return {"message": "Embeddings already exist for all reviews!"}

        client = OpenAI(
            base_url=setting.OPENROUTER_API_BASE_URL,
            api_key=setting.OPENROUTER_API_KEY,
        )

        processed_count = 0

        for review in reviews:
            logger.info(f"Generating embedding for review ID: {review.id}")

            response = client.embeddings.create(
                model=setting.EMBEDDING_MODEL,
                input=review.raw_text,
            )

            review.embedding = response.data[0].embedding
            processed_count += 1

        db.commit()

        logger.info(
            f"Success! Embeddings generated for {processed_count} reviews."
        )

        return {
            "message": f"Success! Embeddings generated for {processed_count} reviews."
        }

    except Exception as e:
        db.rollback()
        logger.error(f"Embedding Error: {e}")
        return {"error": str(e)}