# backend/app/config.py

from pydantic_settings import BaseSettings

from app.constants import PROJECT_NAME


class Settings(BaseSettings):
    PROJECT_NAME: str = PROJECT_NAME
    LOG_LEVEL: str = "INFO"
    PYTHON_ENV: str = "dev"
    GOOGLE_API_KEY: str
    GOOGLE_APPLICATION_CREDENTIALS: str
    PROJECT_ID: str
    LOCATION: str
    GCP_BUCKET_NAME: str  # Name of the GCP bucket for storing captures
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION_NAME: str = "genaigenesis"
    LANGSMITH_TRACING: str
    LANGSMITH_ENDPOINT: str
    LANGSMITH_API_KEY: str
    LANGSMITH_PROJECT: str

    class Config:
        env_file = ".env"


settings = Settings()
