import os 
from dotenv import load_dotenv
load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_API_BASE_URL = os.getenv("OPENROUTER_API_BASE_URL")

    EMBEDDING_MODEL = "openai/text-embedding-3-small"
    CHAT_MODEL = "google/gemma-3n-e4b-it"

    CHUNK_SIZE = 1000
    KMEANS_CLUSTER = 2
    RAG_TOP_K_RESULTS = 3

setting = Settings()

