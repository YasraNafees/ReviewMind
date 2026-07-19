from openai import OpenAI
from models import Review
from config import setting
from logger import get_logger

logger = get_logger(__name__)


def ask_bot(question: str, db):
    try:
        # Initialize OpenRouter client
        client = OpenAI(
            base_url=setting.OPENROUTER_API_BASE_URL,
            api_key=setting.OPENROUTER_API_KEY,
        )

        logger.info("Chatbot: Generating question embedding...")

        # Generate embedding for the user's question
        q_response = client.embeddings.create(
            model=setting.EMBEDDING_MODEL,
            input=question
        )

        q_embedding = q_response.data[0].embedding

        logger.info("Chatbot: Searching similar reviews...")

        # Retrieve the most relevant reviews
        closest_reviews = (
            db.query(Review.raw_text, Review.sentiment_label)
            .order_by(Review.embedding.cosine_distance(q_embedding))
            .limit(setting.RAG_TOP_K_RESULTS)
            .all()
        )

        # Build context
        context = "\n".join(
            f"Review: {review} ({sentiment})"
            for review, sentiment in closest_reviews
        )

        prompt = f"""
You are an AI business assistant.

Use ONLY the reviews below to answer the question.

Reviews:
{context}

Question:
{question}

Answer in exactly 2 concise lines with actionable advice.
"""

        logger.info("Chatbot: Sending prompt to OpenRouter...")

        response = client.chat.completions.create(
            model=setting.CHAT_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        answer = response.choices[0].message.content

        logger.info("Chatbot: Response generated successfully.")

        return {
            "answer": answer
        }

    except Exception as e:
        logger.error(f"Chatbot Error: {e}")
        return {
            "error": str(e)
        }