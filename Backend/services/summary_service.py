from openai import OpenAI
from models import Review
from config import setting
from logger import get_logger
import json


logger = get_logger(__name__)


MAX_REVIEWS_PER_CLUSTER = 30



def clean_reviews(reviews):

    cleaned = []

    seen = set()

    for review in reviews:

        if not review[0]:
            continue

        text = str(review[0]).strip()

        if not text:
            continue

        text_key = text.lower()

        if text_key not in seen:

            seen.add(text_key)

            cleaned.append(text)


    return cleaned




def generate_summary(db):

    try:

        logger.info(
            "Production summary generation started."
        )


        clusters = (

            db.query(
                Review.cluster_id
            )

            .filter(
                Review.cluster_id.isnot(None)
            )

            .distinct()

            .all()

        )



        if not clusters:

            return {

                "summary": {},

                "overall_summary":
                "No clusters found."

            }





        client = OpenAI(

            base_url=setting.OPENROUTER_API_BASE_URL,

            api_key=setting.OPENROUTER_API_KEY,

            timeout=60

        )



        cluster_summaries = {}




        for cluster in clusters:


            cluster_id = cluster[0]


            logger.info(
                f"Processing cluster {cluster_id}"
            )



            reviews = (

                db.query(
                    Review.raw_text
                )

                .filter(
                    Review.cluster_id == cluster_id
                )

                .all()

            )



            cleaned_reviews = clean_reviews(
                reviews
            )



            group_name = (
                f"Group {cluster_id + 1}"
            )



            if not cleaned_reviews:


                cluster_summaries[group_name] = (

                    "Summary: No valid reviews available.\n\n"

                    "Strengths: "
                    "The available reviews do not provide enough information.\n\n"

                    "Weaknesses: "
                    "The available reviews do not provide enough information.\n\n"

                    "Suggestion: "
                    "Collect more customer feedback."

                )


                continue





            # Limit reviews for AI context

            sampled_reviews = (
                cleaned_reviews[:MAX_REVIEWS_PER_CLUSTER]
            )



            context = "\n".join(
                sampled_reviews
            )



            prompt = f"""

You are a professional Business Intelligence Analyst.

Analyze ONLY the customer reviews provided below.

REVIEWS:
----------------
{context}
----------------


Rules:

- Use only provided reviews.
- Never invent information.
- Never assume.
- Ignore duplicate reviews.
- Focus only on repeated patterns.
- If information is unavailable clearly say:
"The available reviews do not provide enough information."


Return JSON only:

{{
"summary":"",
"strengths":[],
"weaknesses":[],
"suggestion":""
}}

"""




            response = client.chat.completions.create(

                model=setting.CHAT_MODEL,

                temperature=0.1,

                max_tokens=500,

                response_format={
                    "type":"json_object"
                },


                messages=[


                    {

                        "role":"system",

                        "content":
                        """
You are a strict customer review analyst.
Only use provided information.
Never hallucinate.
"""

                    },


                    {

                        "role":"user",

                        "content":prompt

                    }


                ]

            )



            content = (

                response
                .choices[0]
                .message
                .content
                .strip()

            )



            try:

                parsed = json.loads(content)


                formatted = (

                    f"Summary:\n"
                    f"{parsed.get('summary','')}\n\n"

                    f"Strengths:\n"
                    f"{', '.join(parsed.get('strengths', []))}\n\n"

                    f"Weaknesses:\n"
                    f"{', '.join(parsed.get('weaknesses', []))}\n\n"

                    f"Suggestion:\n"
                    f"{parsed.get('suggestion','')}"

                )


                cluster_summaries[group_name] = formatted



            except Exception:


                cluster_summaries[group_name] = content





        overall_prompt = f"""

You are a business manager.

Combine these review group reports.

Reports:

{json.dumps(cluster_summaries, indent=2)}


Create a short executive insight.

Return:

Overall Summary:
(one sentence)

Top Strengths:
(list)

Main Problems:
(list)

Recommended Action:
(one action)

Only use provided information.

"""



        overall_response = client.chat.completions.create(


            model=setting.CHAT_MODEL,


            temperature=0.1,


            max_tokens=600,


            messages=[


                {

                    "role":"system",

                    "content":
                    "Create factual business reports only."

                },


                {

                    "role":"user",

                    "content":overall_prompt

                }


            ]

        )



        overall_summary = (

            overall_response
            .choices[0]
            .message
            .content
            .strip()

        )



        logger.info(
            "Summary generation completed successfully."
        )



        return {


            "summary":
            cluster_summaries,


            "overall_summary":
            overall_summary


        }





    except Exception as e:


        logger.error(
            f"Summary Error: {str(e)}"
        )


        db.rollback()


        return {


            "summary": {},


            "overall_summary":
            "Unable to generate summary."


        }