from openai import OpenAI
from models import Review
from config import setting
from logger import get_logger

logger=get_logger(__name__)

def ask_bot(question: str, db):
    try:
        client = OpenAI(
            base_url=setting.Openrouter_base_url,
            api_key=setting.OPENROUTER_API_KEY,
        )

        logger.info("Chatbot: Generating question embedding...")
        q_response = client.embeddings.create(
            model=setting.EMBEDDING_MODEL,
            input=question
        )
        q_embedding = q_response.data[0].embedding

        logger.info("Chatbot: Searching database...")
        closest_reviews = db.query(Review.raw_text, Review.sentiment_label)\
            .order_by(Review.embedding.cosine_distance(q_embedding))\
            .limit(setting.RAG_TOP_K_RESULTS).all()

        context = "\n".join([f"Review: {r[0]} ({r[1]})" for r in closest_reviews])

        prompt = f"""You are a strict business manager. Based ONLY on these reviews: {context}. 
        Answer in exactly 2 lines. Give actionable advice.
        Question: {question}"""

        logger.info("Chatbot: Asking Gemini...")
        response = client.chat.completions.create(
            model=setting.CHAT_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"answer": response.choices[0].message.content}
    except Exception as e:
        logger.error(f"Chatbot Error: {str(e)}")
        return {"error": str(e)}
print("chat successful")