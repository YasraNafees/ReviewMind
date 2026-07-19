from openai import OpenAI
from models import Review
from config import setting
from logger import get_logger

logger = get_logger(__name__)


def generate_summary(db):
    try:
        logger.info("Summary generation started.")

        clusters = (
            db.query(Review.cluster_id)
            .filter(Review.cluster_id.isnot(None))
            .distinct()
            .all()
        )

        if not clusters:
            logger.warning("No clusters found.")
            return {
                "message": "No clusters found!"
            }


        client = OpenAI(
            base_url=setting.OPENROUTER_API_BASE_URL,
            api_key=setting.OPENROUTER_API_KEY,
        )


        summaries = {}


        for cluster_tuple in clusters:

            cluster_id = cluster_tuple[0]

            reviews = (
                db.query(Review.raw_text)
                .filter(
                    Review.cluster_id == cluster_id
                )
                .all()
            )


            if not reviews:
                continue


            # Remove duplicates + empty reviews
            unique_reviews = list(
                set(
                    str(review[0]).strip()
                    for review in reviews
                    if review[0]
                    and str(review[0]).strip()
                )
            )


            if not unique_reviews:
                summaries[f"Cluster_{cluster_id}"] = (
                    "Summary: No valid review text available.\n"
                    "Strengths: None available.\n"
                    "Weaknesses: None available.\n"
                    "Suggestion: Collect more customer feedback."
                )
                continue


            # Limit context size
            unique_reviews = unique_reviews[:50]


            combined_text = "\n".join(unique_reviews)


            prompt = f"""
You are a Senior Business Intelligence Analyst.

Analyze ONLY the customer reviews provided below.

Customer Reviews:
-----------------
{combined_text}
-----------------

STRICT RULES:

1. Use ONLY the provided reviews.
2. Do NOT invent facts, products, features, prices, or opinions.
3. Do NOT make assumptions.
4. Ignore duplicate reviews.
5. Identify only frequently mentioned patterns.
6. If information is missing, say:
"The available reviews do not provide enough information."
7. Keep the answer concise and business focused.

Return exactly this format:

Summary:
One sentence summary.

Strengths:
Positive points from reviews only.

Weaknesses:
Negative points from reviews only.

Suggestion:
One practical improvement based only on reviews.
"""


            logger.info(
                f"Generating summary for Cluster {cluster_id}"
            )


            response = client.chat.completions.create(
                model=setting.CHAT_MODEL,
                temperature=0.2,
                top_p=0.8,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a strict review analysis AI. "
                            "Never hallucinate. "
                            "Only use provided customer reviews."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            )


            if (
                response.choices
                and response.choices[0].message.content
            ):
                summaries[f"Cluster_{cluster_id}"] = (
                    response.choices[0]
                    .message
                    .content
                    .strip()
                )
            else:
                summaries[f"Cluster_{cluster_id}"] = (
                    "No summary generated."
                )


        logger.info(
            "Summary generation completed successfully."
        )


        return {
            "summary": summaries
        }


    except Exception as e:

        logger.error(
            f"Summary Error: {str(e)}"
        )

        db.rollback()

        return {
            "error": str(e)
        }