import numpy as np
from sklearn.cluster import KMeans
from models import Review
from config import setting
from logger import get_logger

logger = get_logger(__name__)


def cluster_review(db):
    try:
        reviews = (
            db.query(Review)
            .filter(
                Review.embedding != None,
                Review.cluster_id == None
            )
            .all()
        )

        if not reviews:
            return {
                "message": "Reviews are already clustered!"
            }

        # Convert embeddings into numpy array
        embeddings = np.array(
            [review.embedding for review in reviews]
        )

        logger.info(
            f"Starting clustering for {len(reviews)} reviews."
        )

        kmeans = KMeans(
            n_clusters=setting.KMEANS_CLUSTER,
            random_state=42,
            n_init=10
        )

        clusters = kmeans.fit_predict(embeddings)

        for index, review in enumerate(reviews):
            review.cluster_id = int(clusters[index])

        db.commit()

        logger.info(
            f"Success! {len(reviews)} reviews grouped."
        )

        return {
            "message": (
                f"Success! {len(reviews)} reviews grouped "
                f"into {setting.KMEANS_CLUSTER} clusters."
            )
        }

    except Exception as e:
        db.rollback()

        logger.error(
            f"Clustering Error: {str(e)}"
        )

        return {
            "error": str(e)
        }


