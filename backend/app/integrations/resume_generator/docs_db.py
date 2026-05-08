# db.py
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from core.config import settings
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = OpenAIEmbeddings(
    model_name="text-embedding-3-large",
)


async def vectorstore(collection="jp_snippets"):
    return PGVector(
        connection=os.getenv("PG_CONN"),
        collection_name=collection,
        embeddings=embeddings,
    )
