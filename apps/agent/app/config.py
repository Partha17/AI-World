from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_role_key: str = ""
    database_url: str = ""
    google_api_key: str = ""
    embedding_model: str = "gemini-embedding-001"
    embedding_dimensions: int = 3072
    llm_model: str = "gemini-2.5-flash-lite"
    agent_service_port: int = 8000
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
