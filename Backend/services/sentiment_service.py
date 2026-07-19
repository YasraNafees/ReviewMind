from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from models import Review
from logger import get_logger

logger = get_logger(__name__)

analyzer = SentimentIntensityAnalyzer()


def process_sentiments(db):

    try:
        reviews = (
            db.query(Review)
            .filter(Review.sentiment_label == None)
            .all()
        )

        if not reviews:
            logger.info("All reviews are already processed!")
            return {
                "message": "All reviews are already processed!"
            }

        processed_count = 0

        for review in reviews:

            if review.score in [1, 2]:
                review.sentiment_label = "Negative"
                review.sentiment_score = 0.1

            elif review.score in [4, 5]:
                review.sentiment_label = "Positive"
                review.sentiment_score = 0.9

            elif review.score == 3:

                scores = analyzer.polarity_scores(
                    review.raw_text or ""
                )

                compound = scores["compound"]

                if compound >= 0.05:
                    review.sentiment_label = "Positive"
                    review.sentiment_score = compound

                elif compound <= -0.05:
                    review.sentiment_label = "Negative"
                    review.sentiment_score = compound

                else:
                    review.sentiment_label = "Neutral"
                    review.sentiment_score = compound

            processed_count += 1

        db.commit()

        logger.info(
            f"Success! Sentiment calculated for {processed_count} reviews."
        )

        return {
            "message": f"Success! Sentiment calculated for {processed_count} reviews."
        }

    except Exception as e:
        db.rollback()

        logger.error(
            f"Sentiment Error: {str(e)}"
        )

        return {
            "error": str(e)
        }