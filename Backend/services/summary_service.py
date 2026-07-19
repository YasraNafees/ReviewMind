from openai import OpenAI
from models import Review
from config import setting
from logger import  get_logger

logger=get_logger(__name__)

def generate_summary(db):
    try:
        clusters=db.query(Review.cluster_id).distinct().all()
        if not clusters:
            return {"message":"No Cluster found!"}
        
        client=OpenAI(
            base_url=setting.Openrouter_base_url,
            api_key=setting.Openrouter_api_key,

        )

        summerize={}
        for cluster_tuple in clusters:
            c_id=cluster_tuple[0]
            review_in_cluster=db.query(Review.raw_text).filter(Review.cluster_id==c_id).all()
            combined_text=" ".join([r[0]] for r in review_in_cluster)

            prompt=f"""Analyze these reviews : {combined_text}.
            Give exactly two things:
            1. Summary: One line summary.
            2. Suggestion: One actionable step.
            Format: Summary: ... \nSuggestion: ... """
            logger.info(f"Generating Summary for Cluster {c_id}")
            response=client.chat.completions.create(
                model=setting.Chat_Model,
                messages=[{"role":"user","content":prompt}]
            )
            summerize[f"Cluster_{c_id}"]=response.choices[0].message.content
        return {"Summerize":summerize}
    except Exception as e:
        logger.error(f"Summary Error:{str(e)}")
        return {"error":str(e)}

print("summary services")

