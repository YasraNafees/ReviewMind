from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import upload, dashboard, ai_routes
from logger import get_logger

logger = get_logger(__name__)

app = FastAPI(title="ReviewMind AI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS middleware configured")


app.include_router(upload.router)
app.include_router(dashboard.router)
app.include_router(ai_routes.router)

logger.info("All routers loaded successfully")


@app.get("/")
def read_root():
    logger.info("Root endpoint hit")
    return {"message": "ReviewMind Backend is Live and Modular!"}