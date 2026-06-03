from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DataSense AI"
    API_V1_STR: str = "/api/v1"
    
    # Supabase (PostgreSQL) Database URL
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/datasense"
    
    # Supabase Auth configuration
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # AI Provider Configuration
    ACTIVE_AI_PROVIDER: str = "GEMINI"
    AI_MODEL_NAME: str = "gemini-2.5-flash"

    # Google Gemini API Key
    GEMINI_API_KEY: str = ""

    # NVIDIA API Key
    NVIDIA_API_KEY: str = ""
    class Config:
        env_file = ".env"

settings = Settings()
