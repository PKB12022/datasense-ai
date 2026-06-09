import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
# Add your Vercel production URL to ALLOWED_ORIGIN env var on Render, e.g.:
# ALLOWED_ORIGIN=https://datasense-ai.vercel.app
_extra_origin = os.getenv("ALLOWED_ORIGIN", "")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if _extra_origin:
    origins.append(_extra_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Only initialize DB if we want to auto-create tables
    # Usually in production we use Alembic for migrations
    init_db()

app.include_router(api_router, prefix=settings.API_V1_STR)
