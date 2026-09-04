from openai import OpenAI

from core.config import settings


def get_openai_client() -> OpenAI:
    if settings.openai_api_key is None:
        raise RuntimeError("OPENAI_API_KEY is not set in backend/.env or the environment.")
    return OpenAI(api_key=settings.openai_api_key.get_secret_value())


model_name = settings.openai_model
