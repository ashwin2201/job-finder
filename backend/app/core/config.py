from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    frontend_origin: str = "http://localhost:3000"
    clerk_issuer: str | None = None
    clerk_audience: str | None = None
    clerk_authorized_party: str | None = None
    clerk_webhook_secret: SecretStr | None = None
    openai_api_key: SecretStr | None = None
    openai_model: str = "gpt-5.4"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        env_prefix="",
        extra="ignore",
    )


settings = Settings()
