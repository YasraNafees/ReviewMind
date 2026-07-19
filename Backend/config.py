import os 
from dotenv import load_dotenv
load_dotenv()

class Settings:
    DataBase_URL:str=os.getenv("DATABASE_URL")
    Openrouter_api_key:str=os.getenv("OPENROUTER_API_KEY")
    Openrouter_base_url :str=os.getenv("OPENROUTER_API_BASE_URL")
    EMBEDDING_MODEL: str = "openai/text-embedding-3-small"

    Chat_Model :str="google/gemini-2.5-flash-lite-preview-09-2025"
    Chunk_size: int=1000
    KMEANS_Cluster:int=2
    RAG_Top_k_Result:int=3
setting=Settings()

print("Configuration succeesful")