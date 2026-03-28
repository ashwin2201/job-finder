from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    pg_conn: str = "postgresql+psycopg://postgres:root@localhost:5432/job_finder"
    frontend_origin: str = "http://localhost:3000"
    openai_api_key: SecretStr | None = None
    openai_model: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="",
        extra="ignore",
    )


settings = Settings()
