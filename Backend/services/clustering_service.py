import numpy as np 
from sklearn.cluster import KMeans
from models import Review
from config import setting
from logger import get_logger

logger=get_logger(__name__)

def cluster_review(db):
    try:
        reviews=db.query(Review).filter(Review.embedding !=None,Review.cluster_id==None).all()
        if not reviews:
            return{"message":"Reviews are already clusterd !"}
        embeddings=np.array(list[review.embedding]for review in reviews)
        kmeans=KMeans(n_clusters=setting.KMEANS_Cluster,random_state=42, n_init=10)
        clusters=kmeans.fit_predict(embeddings)

        for i,review in enumerate(reviews):
            review.cluster_id=int(clusters[i])
            
        db.commit()
        logger.info(f"Success !{len(reviews)}reviews grouped.")
        return{"message":f"Success!{len(reviews)} reviws grouped into{setting.KMEANS_Cluster} clusters. "}
    except Exception as e:
        db.rollback()
        logger.error(f"Clustering Error: {str(e)}")
        return{"error":str(e)}
    
print("clustering succesful")
