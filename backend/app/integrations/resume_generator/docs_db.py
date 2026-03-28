# db.py
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres.vectorstores import PGVector

from app.core.config import settings


embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/multilingual-e5-large",
)


async def vectorstore(collection="jp_snippets"):
    return PGVector(
        connection=settings.pg_conn,
        collection_name=collection,
        embeddings=embeddings,
    )
